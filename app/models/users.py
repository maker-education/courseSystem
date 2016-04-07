#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from ._base import db
from flask.ext.security import Security, SQLAlchemyUserDatastore,\
            UserMixin, RoleMixin, login_required
from itsdangerous import (TimedJSONWebSignatureSerializer \
                                  as Serializer, BadSignature, SignatureExpired)
from flask.ext.security import SQLAlchemyUserDatastore
from datetime import datetime
from config import Config

# 用户-角色 关系
roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

# 用户-组 关系
groups_users = db.Table('groups_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('group_id', db.Integer(), db.ForeignKey('group.id')))

class User(db.Model, UserMixin):
    __tablename__ = "user"

    id =       db.Column(db.Integer, primary_key=True)
    name =     db.Column(db.String(64), unique=True, index=True)
    nick =     db.Column(db.String(64))
    password = db.Column(db.String(255))
    active =   db.Column(db.Boolean())
    create_time = db.Column(db.DateTime, default=datetime.now)
    roles =    db.relationship('Role', secondary=roles_users,
            backref=db.backref('users', lazy='dynamic', order_by=name))

    access_groups = db.relationship('Group', secondary=groups_users,
            backref=db.backref('access_users', lazy='dynamic'))

    own_group_id = db.Column(db.Integer,db.ForeignKey('group.id'))
    own_group = db.relationship('Group', backref='own_groups', order_by=name)

    posts =  db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % self.name

    def is_active(self):
        if self.active:
            return True
        else:
            return False

    def verify_password(self, password):
        password = ''.join(password.split())
        password = unicode(password)
        return self.password == password

    def generate_auth_token(self, expiration=600):
        s = Serializer(Config.SECRET_KEY, expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(Config.SECRET_KEY)
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None # invalid token
        except:
            return None
        user = User.query.get(data['id'])
        return user


class Role(db.Model, RoleMixin):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)
    description = db.Column(db.String(255))

    def __repr__(self):
        return '<Role %r>' % self.name

class Group(db.Model, RoleMixin):
    __tablename__ = "group"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)
    description = db.Column(db.String(255))


    def __repr__(self):
        return '<Group %r>' % self.name

