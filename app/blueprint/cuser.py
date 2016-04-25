#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth, db, User
from config import DEFAULT_PERSON_IMG_FILE, DEFAULT_PERSON_AVATAR_PATH, DEFAULT_CLINET
import os, subprocess
from .util import *

bluep_cuser = Blueprint('cuser', __name__)

def get_avatar():
    path_file = DEFAULT_PERSON_AVATAR_PATH +  '/' + ('%d' % g.user.id) + ".jpg"
    default_path = DEFAULT_CLINET + path_file
    #_passdb.session.query(User.nick, User.name, User.id).filter(User.id == g.user.id).one_or_none()
    img_path = path_file if (os.path.isfile(default_path)) else DEFAULT_PERSON_IMG_FILE
    return img_path


@bluep_cuser.route('/', methods=['GET'])
@httpauth.login_required
def cuser():
    user = g.user
    u = {
        "id" : user.id,
        "name" : user.name,
        "nick" : user.nick,
        "nick" : user.nick,
        "role_names" : role_names(user.roles),
        "group_name" : user.own_group.name,
        "img_path" : get_avatar(),
        }
    return jsonify(u)


@bluep_cuser.route('/cpd', methods=['POST'])
@httpauth.login_required
def changepd():
    passwd = request.json.get('passwd')
    if passwd and passwd == g.user.password :
        return jsonify({ 'success':'ok' })
    else :
        return jsonify({ 'error_info':'密码错误' })


@bluep_cuser.route('/avatar', methods=['POST'])
@httpauth.login_required
def changAvatar() :
    f = request.files['file']
    fn = ('%d' % g.user.id) + '.jpg'
    path = os.path.join(DEFAULT_CLINET + DEFAULT_PERSON_AVATAR_PATH, fn)
    f.save(path)
    f.close()
    timeout_command('convert -resize "400x400^" '+ path + ' ' + path, 10)
    #subprocess.Popen('convert -resize "400x400^" '+ path + ' ' + path, shell=True)
    return jsonify({'answer':'File transfer completed'})


def role_names(roles):
    rol_names = []
    for r in roles:
        rol_names.append(r.name)

    return rol_names

