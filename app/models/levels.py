#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from g import db

class Level(db.Model):
     __tablename__ = "level"

     id = db.Column(db.Integer, primary_key=True)
     level = db.Column(db.String(32), unique=True, index=True)
     name = db.Column(db.String(64))
     description = db.Column(db.String(512))

     def __repr__(self):
         return '<Level %r>' % self.name


