#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from datetime import datetime
import os, subprocess, uuid
from sqlalchemy import and_
from app.models import *
from .util import *
from config import *

bluepContentPrefix='/api/_content'

bluep_content = Blueprint('content', __name__)
string_templet = '<script type="text/javascript">\r\twindow.parent.CKEDITOR.tools.\
callFunction("%s", "%s", "%s");\r</script>'

@bluep_content.route('/fileupload', methods=['POST'])
@httpauth.login_required
def postupload():
    base_path = basedir + CONTENT_IMAGE_PATH
    relat_path = '%d/%s/%s' % (g.user.id, datetime.now().strftime("%Y"),
            datetime.now().strftime("%m"))
    file_path = os.path.join(base_path, relat_path)
    if not os.path.exists(file_path):
        os.makedirs(file_path)

    funnum = request.args.get('CKEditorFuncNum')
    if not funnum: return "error"
    upload_file = request.files.get('upload')
    if not upload_file: return string_templet % (funnum, '', '没有文件')

    suffix = upload_file.filename.split('.')[-1]
    if (not suffix) or (suffix not in ['jpg', 'jpeg', 'gif', 'png', 'bmp']):
        return string_templet % (funnum, '', '文件类型无法识别')

    filename = uuid.uuid1().hex + '.' + suffix
    file_path_name = os.path.join(file_path, filename)
    upload_file.save(file_path_name)

    out, err = timeout_command('convert -resize "800x1600>" '+ file_path_name + ' ' + file_path_name , 10)
    if err: return string_templet % (funnum, '', '文件损坏')

    web_path = os.path.join(bluepContentPrefix, 'static', relat_path, filename)

    return string_templet % (funnum, web_path + '?token=' + g.token, '')


@bluep_content.route('/static/<path:file_path>/<filename>', methods=['GET'])
#@httpauth.login_required
def static(file_path, filename):
    att = False
    if request.args.get('d'):
        att = True
    path = os.path.join(basedir + CONTENT_IMAGE_PATH, file_path)
    return send_from_directory(path, filename, as_attachment=att)


@bluep_content.route('/save', methods = ['POST'])
@httpauth.login_required
def _save():
    return save()

@bluep_content.route('/save/<id>', methods = ['POST'])
@httpauth.login_required
def _edit(id):
    return save(id)

def save(id= None):
    c = request.json

    if id:
        post = db.session.query(Post).filter(Post.id==id).one_or_none()
        if not post : return jsonify({ 'error_info': "文章不存在!" })
        if not isUserSelf(post.user_id) : return jsonify({ 'error_info': "没有权限!" })
        j = { 'content' :       c.get('content'),
            'title' :         c.get('title') ,
            'update_time' :    formateTime(datetime.now()) }

        db.session.query(Post).filter(Post.id==id).update(j)
    else:
        post = Post(content=c.get('content'), title=c.get('title'), user_id=g.user.id, \
                 update_time=formateTime(datetime.now()))
        db.session.add(post)

    try:
        db.session.commit()
    except:
        print sys.exc_info()
        return jsonify({ 'error_info': "数据库错误!" })

    return jsonify({'success':'ok', 'id': post.id })


@bluep_content.route('/get/<id>', methods = ['POST'])
@httpauth.login_required
def get(id):
    if not id : jsonify({ 'error_info': "参数错误!" })
    post = db.session.query(Post).filter(Post.id==id).one_or_none()
    if not post : return jsonify({ 'error_info': "文章不存在!" })
    if not isUserSelf(post.user_id) : return jsonify({ 'error_info': "没有权限!" })

    content = { 'content':post.content, 'title': post.title }
    return jsonify({
        'success':'ok',
        'content': content,
    })


@bluep_content.route('/list', methods = ['POST'])
@httpauth.login_required
def list():
    req_search = list_get(request.json,'search').get('value')
    start = list_get(request.json,'start')
    length = list_get(request.json,'length')

    start = start if start else 0
    length = length if length else 1

    filer = True
    if not isAdmin(): filer = (Post.user_id==g.user.id)

    filer2 = True
    if req_search: filer2 = (Post.title.like('%'+ req_search + '%'))

    posts = db.session.query(Post).filter(and_(filer, filer2)).order_by(Post.update_time).all()
    total = len(posts)

    datas= []
    for p in posts[start: start + length] :
        d = {
            "id" : p.id,
            "title" : p.title,
            "create_time" : formateTime(p.create_time),
            "update_time" : formateTime(p.update_time),
            "content" : drop_html(p.content, 50),
            }
        datas.append(d)

    r = {
            "recordsTotal": total,
            "recordsFiltered": total,
            "data": datas
        }

    return jsonify(r)


@bluep_content.route('/delete/<id>', methods = ['POST'])
@httpauth.login_required
def delete(id):
    if not id : return jsonify({'error_info':'错误'})

    post = db.session.query(Post).filter(Post.id==id).order_by(Post.update_time).one_or_none()
    if not isUserSelf(post.user_id) : return jsonify({ 'error_info': "没有权限!" })

    if ( not request.json.get('code') or request.json.get('code') != formateTime(post.create_time)):
        return jsonify({'error_info':'错误'})

    db.session.delete(post)
    db.session.commit()

    return jsonify({'success':'ok'})

