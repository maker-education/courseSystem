#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request
from sqlalchemy import and_
from app.models import *
from config import *
from .util import *
import json, os, string


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
def userAdd():
    j = request.json
    if not j.get('name'):
        return jsonify({ 'error_info': "参数错误!" })

    if j.get('roles'):
        roles = [ db.session.query(Role).filter(Role.name == r).one_or_none() for r in j.get('roles')]
        del j['roles']

    u = User(roles=roles, active = True, password = DEFAULT_USER_PASSWORD, **j)

    db.session.add(u)
    db.session.commit()

    return "lasjdfljasf"
