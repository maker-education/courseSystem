#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint
main = Blueprint('main', __name__)
from . import views
