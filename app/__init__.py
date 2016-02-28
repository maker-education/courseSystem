#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import Security, SQLAlchemyUserDatastore
from config import config
from app.models import db, user_datastore
from app.forms import MyLoginForm

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    # Setup Flask-Security
    security = Security(app, user_datastore, login_form=MyLoginForm)

    from app.blueprint.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from app.blueprint.blog import blog as blog_blueprint
    app.register_blueprint(blog_blueprint, url_prefix='/blog')

    #from app.blueprint.auth import auth as auth_blueprint
    #app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app

