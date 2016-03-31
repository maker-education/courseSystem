#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import g, jsonify
from flask.ext.httpauth import HTTPBasicAuth
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
    g.user = user
    return True

@httpauth.error_handler
def auth_error():
    return jsonify({"error": "Not authenticated!"}), 404

