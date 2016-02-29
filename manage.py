#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
import os, sys
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.security import Security, SQLAlchemyUserDatastore
from app import create_app
from app.forms import MyLoginForm
from app.models import *

reload(sys)
sys.setdefaultencoding('utf-8')

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

manager = Manager(app)
migrate = Migrate(app, db)

def make_shell_context():
    return dict(app=app, db=db)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

#@app.context_processor
#def app_nanavigation():

@manager.command
def test():
    """Run the unit tests."""
    print 'test'

@manager.command
def init():
    """Run the init database."""
    db.drop_all()
    db.create_all()
    role = Role(name = 'test')
    tu = User(name='test', password = 'ttt', active = True)
    tu2 = User(name='t', password = 'ttt', active = False)
    tu.roles.append(role)
    tu2.roles.append(role)
    db.session.add(role)
    db.session.commit()
    db.session.add(tu)
    db.session.add(tu2)
    db.session.commit()

if __name__ == '__main__':
    manager.run()


