#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from g import db
from . import User
from datetime import datetime


class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.Text)
    create_time = db.Column(db.DateTime, default=datetime.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    img_src = db.Column(db.String(512))

    def __repr__(self):
        return '<Post %r>' % self.name



