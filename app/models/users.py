#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from g import db
from flask.ext.security import Security, SQLAlchemyUserDatastore,\
            UserMixin, RoleMixin, login_required
from flask.ext.security import SQLAlchemyUserDatastore
from datetime import datetime

# 用户-角色 关系
roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class User(db.Model, UserMixin):
     __tablename__ = "user"

     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(64), unique=True, index=True)
     nick = db.Column(db.String(64))
     password = db.Column(db.String(255))
     active = db.Column(db.Boolean())
     create_time = db.Column(db.DateTime)
     roles = db.relationship('Role', secondary=roles_users,
             backref=db.backref('users', lazy='dynamic'))

     def __repr__(self):
         return '<User %r>' % self.name

     def is_active(self):
         if self.active:
             return True
         else:
             return False

     def __init__(self, *args, **kwargs):
         kwargs.update(create_time=datetime.now())
         super(User, self).__init__(*args, **kwargs)


class Role(db.Model, RoleMixin):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)
    description = db.Column(db.String(255))

    def __repr__(self):
        return '<Role %r>' % self.name

