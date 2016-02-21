#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import blog

@blog.route('/<userid>', methods=['GET', 'POST'])
def user(userid):
    return '<h1>Blog!</h1>'

