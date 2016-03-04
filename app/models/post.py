#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from g import db
from . import User


class Post(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    body = db.Column(db.String(140))
    create_time = db.Column(db.DateTime, default=datetime.now())

    def __repr__(self):
        return '<Post %r>' % self.name



