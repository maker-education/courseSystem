#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g, request
from app.models import *
from config import *
from .util import *
import json, os, string


bluep_users = Blueprint('users', __name__)

@bluep_users.route('/all', methods=['POST'])
@httpauth.login_required
def _user():
    req_search = list_get(request.json,'search')
    start = list_get(request.json,'start')
    length = list_get(request.json,'length')

    access_group_ids = [ group.id for group in g.user.access_groups ]
    filer = (User.id == g.user.own_group_id)
    #filer = (User.own_group_id.in_(access_group_ids))

    #???添加搜索

    users = db.session.query(User).filter( filer ).all()
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

