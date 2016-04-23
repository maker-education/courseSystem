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
from flask.ext.restless import APIManager
from app import create_app
from config import config as configs
from command import Command
from app.models import *
from datetime import datetime
#from werkzeug.datastructures import Authorization

reload(sys)
sys.setdefaultencoding('utf-8')

appconfig = configs[(os.getenv('FLASK_CONFIG') or 'default')]
app = create_app(appconfig)

manager = Manager(app)
migrate = Migrate(app, db)

@app.route('/api/token', methods=['GET', 'POST'])
@httpauth.login_required
def get_auth_token():
    exp = 12*3600
    token = g.user.generate_auth_token(exp)
    db.session.query(User).filter(User.id == g.user.id).update({'last_login':datetime.now()})
    db.session.commit()
    return jsonify({'token': token.decode('ascii'), 'duration': exp})


apimanager = APIManager(app, flask_sqlalchemy_db=db)
apimanager.create_api(User, methods = ['GET', 'POST', 'DELETE', 'PUT'], \
        preprocessors = user_op_auth_fun_dict, exclude_columns=['password'])

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

