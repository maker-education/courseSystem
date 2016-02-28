#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from flask.ext.security import SQLAlchemyUserDatastore
from users import User, Role
user_datastore = SQLAlchemyUserDatastore(db, User, Role)

