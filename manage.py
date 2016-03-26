#!/usr/bin/env python
#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
import os, sys
from flask import g, request, jsonify
from flask.ext.script import Manager, Shell
from flask.ext.migrate import Migrate, MigrateCommand
from flask.ext.restless import APIManager, ProcessingException
from app import create_app
from config import config as configs
from command import Command
from app.models import *
from werkzeug.datastructures import Authorization

reload(sys)
sys.setdefaultencoding('utf-8')

appconfig = configs[(os.getenv('FLASK_CONFIG') or 'default')]
app = create_app(appconfig)

manager = Manager(app)
migrate = Migrate(app, db)


@httpauth.login_required
def auth_func1(*args, **kwargs):
    pass

def auth_func(*args, **kwargs):
    res = auth_func1()
    if res and res.status_code != 200:
        raise ProcessingException(description='Not authenticated!', code=401)


@app.route('/api/token', methods=['GET', 'POST'])
@httpauth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})

apimanager = APIManager(app, flask_sqlalchemy_db=db)
apimanager.create_api(User, methods=['GET', 'POST', 'DELETE'],
        preprocessors=dict(GET_SINGLE=[auth_func],GET_MANY=[auth_func], DELETE=[auth_func]))

def make_shell_context():
    return dict(app=app, db=db)

manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)

#@app.context_processor
#def app_nanavigation():

@manager.command
def test():
    Command.test()

@manager.command
def init():
    Command.init(db)

if __name__ == '__main__':
    manager.run()


