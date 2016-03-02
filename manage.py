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
from app import create_app
from config import config as configs
from command import Command
from app.forms import MyLoginForm
from app.models import *

reload(sys)
sys.setdefaultencoding('utf-8')

appconfig = configs[(os.getenv('FLASK_CONFIG') or 'default')]
app = create_app(appconfig)

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
    Command.test()

@manager.command
def init():
    Command.init(db)


if __name__ == '__main__':
    manager.run()

