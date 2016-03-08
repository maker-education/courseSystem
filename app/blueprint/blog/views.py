#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import blog
from flask import request, redirect, url_for, jsonify, render_template
from flask.ext.login import current_user
from flask.ext.security import login_required
from app.models import Post, db
from config import basedir
import urllib, os, base64, time


@blog.route('/user/<userid>', methods=['GET'])
def user(userid):
    return '<h1>Blog!</h1>'


@login_required
@blog.route('/post', methods=['GET', 'POST'])
def post():
    if request.method == 'GET':
        return  render_template('blog_post.html')

    if request.json:
        success = False
        file_name = None
        if request.json.get('img'):
            img = urllib.unquote(request.json.get('img'))
            (img_data, img_type) = parse(img)
            if img:
                file_name = savefile(current_user.name, img_type, img_data)

        p = request.json.get('post').encode('utf8')
        content = urllib.unquote(p)
        post = Post(author = current_user._get_current_object(), img_src=file_name,\
                content = unicode(content, 'utf8'))
        db.session.add(post)
        db.session.commit()
        success = True

        return jsonify(success = success)

def parse(d):
    SPLIT_BASE_STR = ';base64,'
    SPLIT_TPYE_STR = 'image/'
    error = False
    if len(d.split(SPLIT_BASE_STR)) == 2:
        img = d.split(SPLIT_BASE_STR)[1]
        data_type = d.split(SPLIT_BASE_STR)[0]
        if len(data_type.split(SPLIT_TPYE_STR)) == 2:
            data_type = data_type.split(SPLIT_TPYE_STR)[1]
            try:
                imgsrc = base64.b64decode(img)
            except:
                error = True
    if (error):
        return (None, None)
    else:
        return (imgsrc, data_type)


def get_dir(d, t):
    IMG_BASE_DIR = '/app/static/img_content/'
    date = time.strftime("%Y-%m", time.localtime())
    img_dir = basedir + IMG_BASE_DIR + d + '/' + date
    if not os.path.exists(img_dir):
        os.makedirs(img_dir)
    n = len(os.listdir(img_dir))
    file_name = img_dir + '/' + '%d'%n + '.' + t
    while os.path.exists(file_name):
        n = n + 1
        file_name = img_dir +  '/%d'%n + '.' + t
    return file_name


def savefile(username, img_type, img_data):
    file_name = get_dir(username, img_type)
    try:
        f = open(file_name, 'wb')
        f.write(img_data)
        f.close()
    except:
        return False
    return file_name
