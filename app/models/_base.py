#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask.ext.sqlalchemy import SQLAlchemy
db = SQLAlchemy()

from users import User, Role

