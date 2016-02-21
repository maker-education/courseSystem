#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description

    :copyright: (c) 2016 by Liu Wei.
"""

from . import auth

@auth.route('/login', methods=['GET', 'POST'])
def login():
    return '<h1>Auth</h1>'

