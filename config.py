#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

import os

basedir = os.path.abspath(os.path.dirname(__file__))
TOPIC_DIR = os.path.join(basedir, '_topics')
TOPIC_INIT_FILE_NAME = 'topic.info.json'
TOPIC_PPT_FILE_NAME = 'topic.ppt.md'
DEFAULT_CLINET = basedir + '/client'
DEFAULT_PERSON_AVATAR_PATH = '/_avatar'
DEFAULT_PERSON_IMG_FILE = DEFAULT_PERSON_AVATAR_PATH + '/_0.jpg'

#-------------
CONTENT_IMAGE_PATH = '/_content'

#-------------
ROLE_TEACHTER = u'老师'
ROLE_STUDENT = u'学生'
ROLE_PARENT = u'家长'
ROLE_MANAGE = u'机构'
#-------------
GROUP_MANAGE = u'系统组'

DEFAULT_USER_PASSWORD='6123456'

#ROLE_OBJECT_TEACHER = Role(name = ROLE_TEACHTER)
#ROLE_OBJECT_STUDENT = Role(name = ROLE_STUDENT)
#ROLE_OBJECT_PARENT = Role(name = ROLE_PARENT)
#ROLE_OBJECT_MANAGE = Role(name = ROLE_MANAGE)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'this is a bing change'
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024

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
        'mysql://root:0x9acom123@localhost/x9a'
        #'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


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
