#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore
from app.models import db, user_datastore, MyLoginForm
import datetime

def datetimeformat(value):
    if (value.strftime('%Y-%m-%d') == datetime.datetime.now().strftime('%Y-%m-%d')):
        return value.strftime('%H:%M:%S')
    return value.strftime('%Y-%m-%d %H:%M:%S')

def create_app(appconfig):
    app = Flask(__name__)
    app.config.from_object(appconfig)
    appconfig.init_app(app)

    db.init_app(app)
    # Setup Flask-Security
    security = Security(app, user_datastore, login_form=MyLoginForm)

    from app.blueprint.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from app.blueprint.blog import blog as blog_blueprint
    app.register_blueprint(blog_blueprint, url_prefix='/blog')

    app.jinja_env.filters['datetimeformat'] = datetimeformat

    return app

