#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth
from datetime import datetime
from config import TOPIC_DIR, TOPIC_INIT_FILE_NAME, TOPIC_PPT_FILE_NAME
import os, json

bluep_topics = Blueprint('topics', __name__)

_TIMEFORMAT = '%Y-%m-%d %H:%M:%S'
_PPT_NAME = 'md'
_TOPIC_UPDATETIME_NAME = 'update_time'
_TOPIC_CREATETIME_NAME = 'create_time'

@bluep_topics.route('/list', methods=['GET', 'POST'])
@httpauth.login_required
def list():
    a = {
            "recordsTotal": 57,
            "recordsFiltered": 57,
            "data": [
                {
                    "first_name": "Airi",
                    "last_name": "Satou",
                    "position": "Accountant",
                    "office": "Tokyo",
                    "start_date": "28th Nov 08",
                    "salary": "$162,700"
                    },
                {
                    "first_name": "Angelica",
                    "last_name": "Ramos",
                    "position": "Chief Executive Officer (CEO)",
                    "office": "London",
                    "start_date": "9th Oct 09",
                    "salary": "$1,200,000"
                    },
                {
                    "first_name": "Ashton",
                    "last_name": "Cox",
                    "position": "Junior Technical Author",
                    "office": "San Francisco",
                    "start_date": "12th Jan 09",
                    "salary": "$86,000"
                    },
                {
                    "first_name": "Bradley",
                    "last_name": "Greer",
                    "position": "Software Engineer",
                    "office": "London",
                    "start_date": "13th Oct 12",
                    "salary": "$132,000"
                    },
                {
                    "first_name": "Brenden",
                    "last_name": "Wagner",
                    "position": "Software Engineer",
                    "office": "San Francisco",
                    "start_date": "7th Jun 11",
                    "salary": "$206,850"
                    },
                {
                    "first_name": "Brielle",
                    "last_name": "Williamson",
                    "position": "Integration Specialist",
                    "office": "New York",
                    "start_date": "2nd Dec 12",
                    "salary": "$372,000"
                    },
                {
                        "first_name": "Bruno",
                        "last_name": "Nash",
                        "position": "Software Engineer",
                        "office": "London",
                        "start_date": "3rd May 11",
                        "salary": "$163,500"
                        },
                {
                        "first_name": "Caesar",
                        "last_name": "Vance",
                        "position": "Pre-Sales Support",
                        "office": "New York",
                        "start_date": "12th Dec 11",
                        "salary": "$106,450"
                        },
                {
                        "first_name": "Cara",
                        "last_name": "Stevens",
                        "position": "Sales Assistant",
                        "office": "New York",
                        "start_date": "6th Dec 11",
                        "salary": "$145,600"
                        },
                {
                        "first_name": "Cedric",
                        "last_name": "Kelly",
                        "position": "Senior Javascript Developer",
                        "office": "Edinburgh",
                        "start_date": "29th Mar 12",
                        "salary": "$433,060"
                        }
                ]
    }
    return jsonify(a)

@bluep_topics.route('/upload/<path:topic_name>', methods=['POST'])
@httpauth.login_required
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
def deleteall(topic_name):
    files = _getTopicFiles(topic_name)
    for f in files:
        df = os.path.join(TOPIC_DIR, topic_name, f)
        if (os.path.isfile(f)):
            os.remove(df)
    return jsonify({ 'success':'ok' })


@bluep_topics.route('/get/<path:topic_name>', methods=['GET'])
@httpauth.login_required
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
        'author_id':g.user.id,
        _TOPIC_CREATETIME_NAME:datetime.now().strftime(_TIMEFORMAT)
    }

    topic_name = None
    init_file = None
    if (topic) :
        topic_name = topic.get('name')
        if (_PPT_NAME  in topic.keys()): del topic[_PPT_NAME]
        if ('new_name' in topic.keys()): del topic['new_name']
        if (_TOPIC_CREATETIME_NAME in topic.keys()): del topic[_TOPIC_CREATETIME_NAME]
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
