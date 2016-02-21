#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from app import db

class User(db.Model):

     __tablename__ = "users"
     id = db.Column(db.Integer, primary_key=True)
     username = db.Column(db.String(64), unique=True, index=True)

     def __repr__(self):
         return '<User %r>' % self.username
