#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from app.models import *
from config import *

class Command:

    @staticmethod
    def init(db):
        print "Not Use!"
        return
        """Run the init database."""
        db.drop_all()
        db.create_all()

        r_t = Role(name = ROLE_TEACHTER)
        r_s = Role(name = ROLE_STUDENT)
        r_p = Role(name = ROLE_PARENT)
        r_m = Role(name = ROLE_MANAGE)

        db.session.add(r_t)
        db.session.add(r_s)
        db.session.add(r_p)
        db.session.add(r_m)
        db.session.commit()

        g0 = Group(name = u'系统管')
        g1 = Group(name = u'火星派')
        g2 = Group(name = u'童趣大未来')

        db.session.add(g0)
        db.session.add(g1)
        db.session.add(g2)
        db.session.commit()

        u1 = User(name='lw', password = 'dskl', nick=u'刘卫', own_group = g1,
                access_groups = [g1, g2],  active = True)

        u2 = User(name='Admin', password = 'admin!@#asd', nick=u'管理', active = True)

        u3 = User(name='test', password = '111', nick=u'测试', own_group = g2, active = True)

        u1.roles.append(r_t);
        u1.roles.append(r_m);

        db.session.add(g0)
        db.session.add(u1)
        db.session.add(u2)
        db.session.add(u3)
        db.session.commit()

        ''' 读取等级文件 添加到数据库 '''
        i = 1
        for line in open('resource/level.txt'):
            items = line.split()
            level = Level(id=i, level=unicode(items[0], 'utf8'), name=unicode(items[1], 'utf8'))
            i = i + 1
            db.session.add(level)
        db.session.commit()

    @staticmethod
    def test():
        """Run the unit tests."""
        print 'test'

