#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request
from sqlalchemy import and_, exc
from app.models import *
from config import *
from .util import *
from datetime import datetime
import json, os, string, sys


bluep_users = Blueprint('users', __name__)

@bluep_users.route('/all', methods=['POST'])
@httpauth.login_required
def _user():
    req_search = list_get(request.json,'search').get('value')
    start = list_get(request.json,'start')
    length = list_get(request.json,'length')

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



@bluep_users.route('/add', methods=['POST'])
@httpauth.login_required
def userAdd():
    j = request.json
    if not j.get('name'):
        return jsonify({ 'error_info': "参数错误!" })

    if j.get('roles'):
        roles = [ db.session.query(Role).filter(Role.name == r).one_or_none() for r in j.get('roles')]
        del j['roles']

    #u2 = db.session.query(User).filter(User.id == 4).one_or_none()
    #db.session.delete(u2)
    #db.session.commit()
    if j.get('birthday') and j['birthday'].split('T')[0]:
        j['birthday'] = datetime.strptime(j['birthday'].split('T')[0], '%Y-%m-%d')
    elif j.get('birthday'):
        del j['birthday']

    u = User(own_group=g.user.own_group , roles=roles, active = True, password = DEFAULT_USER_PASSWORD, **j)
    db.session.add(u)

    try:
        db.session.commit()
    except:
        if '1062' in  (sys.exc_info()[1].args[0]):
            return jsonify({ 'error_info': "用户名重复!" })

        print sys.exc_info()
        #return jsonify({ 'error_info': "!" })

    return "错误"
