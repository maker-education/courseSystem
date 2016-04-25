#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import g as _g, jsonify, request
from flask.ext.httpauth import HTTPBasicAuth
from flask.ext.restless import ProcessingException
from functools import wraps
from .users import User
from config import *
import string, base64

httpauth = HTTPBasicAuth()

@httpauth.verify_password
def verify_password(username_or_token, password):
    t = request.args.get('token')
    if t:
        try: t = base64.b64decode(t)
        except: return False
        if t.count(':') < 1: return False
        username_or_token, password = t.split(':')[0:2]

    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(name = username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    _g.user = user
    _g.token = base64.b64encode(username_or_token + ':' + password)
    return True

@httpauth.error_handler
def auth_error():
    return jsonify({"error": "Not authenticated!"}), 404

@httpauth.login_required
def auth_func1(*args, **kwargs):
    pass


def isAdmin():
    if hasattr(_g, 'user') and hasattr(_g.user, 'own_group')\
            and hasattr(_g.user.own_group, 'name'):
        return (_g.user.own_group.name == GROUP_MANAGE)
    return False

def http_login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        res = auth_func1()
        if res and res.status_code != 200:
            raise ProcessingException(description='Not authenticated!', code=401)
        return f(*args, **kwargs)
    return decorated


def isUserSelf(id):
    if not id: return False
    if isinstance(id, str):
        id = string.atol(id)
    if id != None and hasattr(_g, 'user') and id == _g.user.id:
        return True
    else:
        return False


def user_access_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if isUserSelf(kwargs.get('instance_id')) or isAdmin():
            return f(*args, **kwargs)
        else:
            raise ProcessingException(description='Not authenticated!', code=401)
    return decorated


def has_roles(user, roles):
    ''' 注意嵌套用[], 用() 可能会被忽略'''
    has = False
    if user and user.roles:
        has = True
        user_role_names = [role.name for role in user.roles]
        for r in roles:
            if isinstance(r, (list, tuple)):
                # this is a tuple_of_role_names *** OR LOGIC ***
                tuple_of_role_names = r
                is_in_tuple = False
                for role_name in tuple_of_role_names:
                    if role_name in user_role_names:
                        # tuple_of_role_names requirement was met: break out of loop
                        is_in_tuple = True
                        break

                if not is_in_tuple:
                    has = False
                    break
            else:
                # this is a role_name requirement *** AND LOGIC ***
                role_name = r
                # the user must have this role
                if not role_name in user_role_names:
                    has = False
                    break

    return has


def role_access_required(*requirements):
    """ Return True if the user has all of the specified roles. Return False otherwise.
    this function is forked from flask-user __init__.py has_roles

        has_roles() accepts a list of requirements:
            has_role(requirement1, requirement2, requirement3).

        Each requirement is either a role_name, or a tuple_of_role_names.
            role_name example:   'manager'
            tuple_of_role_names: ('funny', 'witty', 'hilarious')
        A role_name-requirement is accepted when the user has this role.
        A tuple_of_role_names-requirement is accepted when the user has ONE of these roles.
        has_roles() returns true if ALL of the requirements have been accepted.

        For example:
            has_roles('a', ('b', 'c'), d)
        Translates to:
            User has role 'a' AND (role 'b' OR role 'c') AND role 'd'"""

    def _required(f):
        @wraps(f)
        def decorated(*args, **kwargs):

            if _g and _g.user and has_roles(_g.user, requirements):
                return f(*args, **kwargs)
            else:
                raise ProcessingException(description='Not authenticated!', code=401)

        return decorated
    return _required

@http_login_required
@user_access_required
def opUserAuth(*args, **kwargs):
    pass

user_op_auth_fun_dict = dict(GET_SINGLE=[opUserAuth],GET_MANY=[opUserAuth], DELETE=[opUserAuth])
