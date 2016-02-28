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
from app import create_app, db
from app.forms import MyLoginForm
from app.models import *

reload(sys)
sys.setdefaultencoding('utf-8')

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore, login_form=MyLoginForm)

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
    tu = User(name='test', passwd = 'ttt', role = role)
    db.session.add(role)
    db.session.commit()
    db.session.add(tu)
    db.session.commit()

if __name__ == '__main__':
    manager.run()


