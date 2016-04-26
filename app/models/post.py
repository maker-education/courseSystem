#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from ._base import db
from . import User
from datetime import datetime


class Post(db.Model):
    __tablename__ = "post"

    id = db.Column(db.Integer, primary_key = True)
    title =  db.Column(db.String(256))
    content = db.Column(db.Text)
    create_time = db.Column(db.DateTime, default=datetime.now)
    update_time = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post title:%r, id:%r>' % (self.title, self.id)


