#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from app.models import *

class Command:


    @staticmethod
    def init(db):
        """Run the init database."""
        db.drop_all()
        db.create_all()
        role = Role(name = 'test')
        tu = User(name='test', password = 'ttt', nick=u'小明', active = True)
        tu2 = User(name='t', password = 'ttt', active = False)
        tu.roles.append(role)
        tu2.roles.append(role)
        db.session.add(role)
        db.session.commit()
        db.session.add(tu)
        db.session.add(tu2)
        db.session.commit()

        ''' 读取等级文件 添加到数据库 '''
        for line in open('resource/level.txt'):
            items = line.split()
            level = Level(level=unicode(items[0], 'utf8'), name=unicode(items[1], 'utf8'))
            db.session.add(level)
        db.session.commit()


    @staticmethod
    def test():
        """Run the unit tests."""
        print 'test'

