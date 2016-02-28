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

class User(db.Model):
     __tablename__ = "users"

     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(64), unique=True, index=True)
     passwd = db.Column(db.String(255))
     active = db.Column(db.Boolean())
     roles_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

     def __repr__(self):
         return '<User %r>' % self.name


class Role(db.Model, RoleMixin):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)
    description = db.Column(db.String(255))
    users = db.relationship('User', backref='role')

    def __repr__(self):
        return '<Role %r>' % self.name

