#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth, db, User, role_access_required
from datetime import datetime
from config import *
import os, json, shutil, uuid

bluep_topics = Blueprint('topics', __name__)

_TIMEFORMAT = '%Y-%m-%d %H:%M:%S'
_PPT_NAME = 'md'
_TOPIC_AUTHORID_NAME = 'author_id'
_TOPIC_UUID_NAME = 'uuid'
_TOPIC_UPDATETIME_NAME = 'update_time'
_TOPIC_CREATETIME_NAME = 'create_time'


@bluep_topics.route('/list', methods=['GET', 'POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def list_root():
    #print request.form
    return _list()


@bluep_topics.route('/list/<path:path>', methods=['GET', 'POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def list_path(path):
    return _list(path)

def _list_find(l, name):
    for i in l:
        if (i.get('name')) and (i.get('name') == name): return i.get('value')
    return None


def _list(path = ''):
    #filter = '*'
    filter = None
    req_search = _list_find(request.json,'search')
    if req_search and req_search.get('value'):
        filter = '*' + req_search.get('value') + '*'

    #目前采用扁平方式，后期采用分层结构
    searh_path = os.path.join(TOPIC_DIR, path)

    # 使用locate速度更快, 但需要updatedb
    #search = 'locate ' + searh_path  + filter + '' + TOPIC_INIT_FILE_NAME
    if filter:
        search = 'find ' + searh_path  + ' -name "' + TOPIC_INIT_FILE_NAME + '" -path "' + filter + '"'
    else:
        search = 'find ' + searh_path  + ' -name "' + TOPIC_INIT_FILE_NAME + '"'

    result = os.popen(search).readlines()
    result.sort()
    topics, num = _authFilter(result, g.user, _list_find(request.json,'start'), \
            _list_find(request.json,'length'))

    r = {
            "recordsTotal": num,
            "recordsFiltered": num,
            "data": topics
        }

    return jsonify(r)

def _authFilter(files, user, start = 0, length = 50):
    id = 0
    topics = []

    if (not start) : start = 0
    else : start = int(start)

    if (not length) or (length > 50): length = 50
    else : length = int(length)

    for f in files :
        f = os.path.join(basedir, f).strip('\n')
        info = {"time": '未设'};
        info.update(eval(open(f).read()))
        if not _isAccess(info, user):
            continue

        if ((not start ) or (id >= start)) and ((not length) or (id < start + length)) :
            #再查询
            query_one_user = db.session.query(User.nick).filter(User.id == info.get('author_id')).one_or_none()
            if query_one_user:
                info.update(autho_name=user.nick)
            info.update(name=info.get('name').decode('raw_unicode_escape'))
            topics.append(info)

        id = id + 1

    return topics, id

def _isAccess(info, user, isAuthor = False):
    if not user: return False

    author_id = info.get(_TOPIC_AUTHORID_NAME)
    if ( not author_id ) :
        return False

    if (isAuthor):
        return (user.id == author_id)

    info_group_id = None
    u = db.session.query(User.own_group_id).filter(User.id == author_id).one_or_none()
    if u :
        info_group_id = u.own_group_id
    else :
        return False

    if (info_group_id != user.own_group_id ):
        for group in user.access_groups:
            if (info_group_id == group.id): return True
        return False

    return True


@bluep_topics.route('/deletetopic/<path:topic_name>', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def delTopic(topic_name):
    f = os.path.join(TOPIC_DIR, topic_name, TOPIC_INIT_FILE_NAME);
    info = eval(open(f).read())
    if ( not request.json.get('code') or request.json.get('code') != info.get('create_time')):
        return jsonify({'error_info':'错误'})

    if not _isAccess(info, g.user, True):
        return jsonify({'error_info':'您没有权限'})

    #delete
    shutil.rmtree(os.path.join(TOPIC_DIR, topic_name))
    return jsonify({ 'success': "ok" })


@bluep_topics.route('/upload/<path:topic_name>', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def upload(topic_name):
    if not os.path.exists( os.path.join(TOPIC_DIR, topic_name) ):
        return jsonify({'error_info':'没有知识点名称'})

    f = request.files['file']
    fname = (f.filename) #获取一个安全的文件名，且仅仅支持ascii字符；
    if (fname in [TOPIC_INIT_FILE_NAME, TOPIC_PPT_FILE_NAME] ):
        return jsonify({'error_info':'文件名和系统冲突错误'})

    if (os.path.exists(fname)):
        return jsonify({'error_info':'文件存在或和知识点冲突'})

    f.save(os.path.join(TOPIC_DIR, topic_name, fname))
    return jsonify({'answer':'File transfer completed'})


@bluep_topics.route('/deletefile', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def deletefile():
    request_json = request.json
    name = request_json.get('topic_name')
    df = request_json.get('delete_file')
    if df and (not (df in [TOPIC_INIT_FILE_NAME, TOPIC_PPT_FILE_NAME])):
        f = os.path.join(TOPIC_DIR, name , df)
        if (os.path.isfile(f)):
            os.remove(f)
        return jsonify({ 'success':'ok' })

    return jsonify({ 'error_info': " 删除失败!" })


@bluep_topics.route('/deleteall/<path:topic_name>', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def deleteAll(topic_name):
    files = _getTopicFiles(topic_name)
    for f in files:
        df = os.path.join(TOPIC_DIR, topic_name, f)
        if (os.path.isfile(f)):
            os.remove(df)
    return jsonify({ 'success':'ok' })


@bluep_topics.route('/get/<path:topic_name>', methods=['GET', 'POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def get(topic_name):
    files = _getTopicFiles(topic_name)
    ppt_file = os.path.join(TOPIC_DIR, topic_name , TOPIC_PPT_FILE_NAME)
    info_file = os.path.join(TOPIC_DIR, topic_name , TOPIC_INIT_FILE_NAME )
    ppt = ''
    info = {}
    if (os.path.isfile(ppt_file)):
        ppt = open(ppt_file).read()

    if (os.path.isfile(info_file)):
        try:
            info = eval(open(info_file).read())
        except:
            info = {}

    return jsonify({
        'success':'ok',
        'files': files,
        'ppt':ppt,
        'info': info
    })


@bluep_topics.route('/create/<path:topic_name>', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def create(topic_name):
    topic = request.json
    name = topic.get('name')
    new_name = topic.get('new_name')

    if (name and new_name and name != new_name):
        ''' 更新知识点 '''
        if not os.path.exists( os.path.join(TOPIC_DIR, name) ):
            return jsonify({
                'error_info': "'" + name + "' 原知识点不存在!",
                })

        if os.path.exists( os.path.join(TOPIC_DIR, new_name) ):
            return jsonify({
                'error_info': "'" + new_name + "' 知识点已经存在!",
                })

        new_dir = os.path.join(TOPIC_DIR, new_name)
        if not os.path.exists(os.path.dirname(new_dir)):
            try:
                os.makedirs(os.path.dirname(new_dir))
            except:
                return jsonify({'error_info': "'" + new_name + "' 目录更新失败!"})

        try:
            os.rename(os.path.join(TOPIC_DIR, name), new_dir)
        except:
            return jsonify({'error_info': "'" + new_name + "' 知识点更新失败!"})


    elif new_name:
        if os.path.exists( os.path.join(TOPIC_DIR, new_name) ):
            return jsonify({
                'error_info': "'" + new_name + "' 知识点已经存在!",
                })
        try:
            os.makedirs(os.path.join(TOPIC_DIR, new_name))
        except:
            return jsonify({'error_info': "'" + new_name + "' 知识点创建失败!"})

    else :
        return jsonify({'error_info': '参数错误!'})

    topic['name'] = new_name

    if not _updateInfo(topic):
         return jsonify({'error_info':'更新信息失败'})

    files = _getTopicFiles(new_name)
    return jsonify({'success':'ok', 'files': files})


@bluep_topics.route('/savemd/<path:topic_name>', methods = ['POST'])
@httpauth.login_required
@role_access_required(ROLE_TEACHTER)
def savemd(topic_name):
    topic = request.json
    name = topic.get('name')
    usetime = topic.get('time')
    ppt_md = topic.get(_PPT_NAME)
    if name and usetime and ppt_md:
        ppt_file = os.path.join(TOPIC_DIR, name , TOPIC_PPT_FILE_NAME)
        f = open(ppt_file, 'w')
        f.write(ppt_md)
        f.close()
        if not _updateInfo(topic):
            return jsonify({'error_info':'更新信息失败'})

        files = _getTopicFiles(name)
        return jsonify({ 'success': "ok", 'files': files })

    return jsonify({ 'error_info': "参数错误!" })


@bluep_topics.route('/static/<path:topic>/<filename>', methods=['GET'])
def static(topic, filename):
    if filename == 'index':
        filepath = os.path.join( TOPIC_DIR, topic, TOPIC_PPT_FILE_NAME )
        if (not os.path.isfile(filepath)):
            return  "该知识点还未保存!"

        c = dict(md = open(filepath).read(), t=topic)
        return render_template('ppt_show.html', t=c)

    att = False
    if request.args.get('d'):
        att = True
    path = os.path.join(TOPIC_DIR, topic)
    return send_from_directory(path, filename, as_attachment=att)


def _getTopicFiles(tname):
    files = []
    root = os.path.join(TOPIC_DIR, tname)
    if os.path.exists( root ):
        for i in os.listdir(root):
            if os.path.isfile(os.path.join(root,i)) and \
                    (not (i in [TOPIC_INIT_FILE_NAME, TOPIC_PPT_FILE_NAME] )):
                files.append(i)
    return files


def _updateInfo(topic = None):
    if not g.user:
        return False

    info = {
        _TOPIC_AUTHORID_NAME :g.user.id,
        _TOPIC_CREATETIME_NAME :datetime.now().strftime(_TIMEFORMAT),
        _TOPIC_UUID_NAME : uuid.uuid1().hex
    }

    topic_name = None
    init_file = None
    if (topic) :
        topic_name = topic.get('name')
        if (_PPT_NAME  in topic.keys()): del topic[_PPT_NAME]
        if ('new_name' in topic.keys()): del topic['new_name']
        if (_TOPIC_CREATETIME_NAME in topic.keys()): del topic[_TOPIC_CREATETIME_NAME]
        if (_TOPIC_AUTHORID_NAME in topic.keys()): del topic[_TOPIC_AUTHORID_NAME] #防止修改权限
        if (_TOPIC_UUID_NAME in topic.keys()): del topic[_TOPIC_UUID_NAME]
        topic[_TOPIC_UPDATETIME_NAME] = datetime.now().strftime(_TIMEFORMAT)
        init_file = os.path.join(TOPIC_DIR, topic_name, TOPIC_INIT_FILE_NAME)

    if (init_file) :
        if (os.path.isfile(init_file)):
            new_info = eval(open(init_file).read())
            if new_info:
                info.update(new_info)

        info.update(topic)
        json.dump(info, open(init_file, 'w'),  indent = 4)
        return  True

    return False

