#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request
from sqlalchemy import and_, exc
from datetime import datetime
import json, os, string, sys
from app.models import *
from config import *
from .util import *

bluep_users = Blueprint('users', __name__)

@bluep_users.route('/all', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_MANAGE)
def _user():
    req_search = list_get(request.json,'search').get('value')
    start = list_get(request.json,'start')
    length = list_get(request.json,'length')

    start = start if start else 0
    length = length if length else 1

    access_group_ids = [ group.id for group in g.user.access_groups ]
    filer = True
    if not isAdmin(): filer = (User.own_group_id == g.user.own_group_id)
    #filer = (User.own_group_id.in_(access_group_ids))

    #添加搜索
    filer2 = True
    if req_search: filer2 = (User.nick.like('%'+ req_search + '%'))

    users = db.session.query(User).filter(and_(filer, filer2)).order_by(User.nick).all()
    total = len(users)

    datas= []
    for u in users[start: start + length] :
        d = {
            "name" : u.name,
            "nick" : u.nick,
            "create_time" : formateTime(u.create_time),
            "sex" : u.sex,
            "birthday" : formateTime(u.birthday),
            "roles": [r.name for r in u.roles],
            }
        datas.append(d)

    r = {
            "recordsTotal": total,
            "recordsFiltered": total,
            "data": datas
        }

    return jsonify(r)


def userFormatBirthday(j):
    b = j.get('birthday')
    if b and b.split('T')[0]:
        j.update( birthday = datetime.strptime(b.split('T')[0], '%Y-%m-%d'))


def userFormatRoles(j):
    if j.get('roles'):
        roles = [ db.session.query(Role).filter(Role.name == r).one_or_none() for r in j.get('roles')]
        j.update(roles=roles)


#兼具add
@bluep_users.route('/add', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_MANAGE)
def _userAdd():
    return userAdd()


#和edit
@bluep_users.route('/edit/<name>', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_MANAGE)
def _userEdit(name):
    return userAdd(name)


def userAdd( name = None ):
    j = request.json
    if not j.get('name'):
        return jsonify({ 'error_info': "参数错误!" })

    userFormatRoles(j)
    userFormatBirthday(j)

    if name:
        roles = j.get('roles')
        del j['roles']
        db.session.query(User).filter(User.name==name).update(j)
        u = db.session.query(User).filter(User.name==name).one_or_none()
        if u:
            u.roles = roles

    else:
        j.update(own_group=g.user.own_group , active = True, password = DEFAULT_USER_PASSWORD)
        u = User(**j)
        db.session.add(u)

    try:
        db.session.commit()
    except:
        if '1062' in  (sys.exc_info()[1].args[0]):
            return jsonify({ 'error_info': "用户名重复!" })

        print sys.exc_info()
        return jsonify({ 'error_info': "数据库错误!" })

    return jsonify({'success':'ok'})


@bluep_users.route('/getone', methods=['POST'])
@httpauth.login_required
@role_access_required(ROLE_MANAGE)
def userget():
    if not isinstance(request.json, dict):
        return jsonify({'error_info':'参数错误'})

    name = request.json.get('name')
    if not name:
        return jsonify({ 'error_info': "参数错误!" })

    u = db.session.query(User).filter(User.name==name).one_or_none()

    if not u : return jsonify({'error_info':'参数错误'})

    d = {
        "name" : u.name,
        "nick" : u.nick,
        "create_time" : formateTime(u.create_time),
        "sex" : u.sex,
        "birthday" : formateTime(u.birthday),
        "roles": [r.name for r in u.roles],
    }
    return jsonify( {'success':'ok', 'data' : d})


@bluep_users.route('/disable', methods=['POST'])
@httpauth.login_required
def userdisable():
    #
    pass

