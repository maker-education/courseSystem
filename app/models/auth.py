#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import g as _g, jsonify
from flask.ext.httpauth import HTTPBasicAuth
from flask.ext.restless import ProcessingException
from functools import wraps
import string
from .users import User

httpauth = HTTPBasicAuth()

@httpauth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(name = username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    _g.user = user
    return True

@httpauth.error_handler
def auth_error():
    return jsonify({"error": "Not authenticated!"}), 404

@httpauth.login_required
def auth_func1(*args, **kwargs):
    pass

def http_login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        res = auth_func1()
        if res and res.status_code != 200:
            raise ProcessingException(description='Not authenticated!', code=401)
        return f(*args, **kwargs)
    return decorated


def user_access_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        id = kwargs.get('instance_id')
        if id :
            id = string.atol(id)
        if id != None and id == _g.user.id:
            return f(*args, **kwargs)
        else:
            raise ProcessingException(description='Not authenticated!', code=401)
    return decorated

@http_login_required
@user_access_required
def opUserAuth(*args, **kwargs):
    pass

user_op_auth_fun_dict = dict(GET_SINGLE=[opUserAuth],GET_MANY=[opUserAuth], DELETE=[opUserAuth])
