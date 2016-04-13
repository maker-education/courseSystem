#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth, db, User
from config import DEFAULT_PERSON_IMG_PATH
import os

bluep_cuser = Blueprint('cuser', __name__)

@bluep_cuser.route('/', methods=['GET', 'POST'])
@httpauth.login_required
def cuser():
    #db.session.query(User.nick, User.name, User.id).filter(User.id == g.user.id).one_or_none()
    user = g.user
    img_path = user.img_path if (user.img_path and os.path.isfile(user.img_path)) else DEFAULT_PERSON_IMG_PATH
    u = {
        "id" : user.id,
        "name" : user.name,
        "nick" : user.nick,
        "nick" : user.nick,
        "role_names" : role_names(user.roles),
        "img_src" : img_path,
        }
    return jsonify(u)


def role_names(roles):
    rol_names = []
    for r in roles:
        rol_names.append(r.name)

    return rol_names
