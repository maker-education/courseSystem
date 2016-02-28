#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a bing change'
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ''' Flask security '''
    SECURITY_PASSWORD_HASH = 'plaintext'
    SECURITY_LOGIN_USER_TEMPLATE = 'login.html'
    SECURITY_USER_IDENTITY_ATTRIBUTES = 'name'
    #SECURITY_URL_PREFIX = '/auth'
    #MAIL_SERVER = 'smtp.googlemail.com'
    #MAIL_PORT = 587
    #MAIL_USE_TLS = True
    #MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    #MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    #FLASKY_MAIL_SUBJECT_PREFIX = '[Flasky]'
    #FLASKY_MAIL_SENDER = 'Flasky Admin <flasky@example.com>'
    #FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-test.sqlite')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data.sqlite')


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
