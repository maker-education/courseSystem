#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import blog
from flask.ext.security import login_required
from flask import render_template

@blog.route('/user/<userid>', methods=['GET'])
def user(userid):
    return '<h1>Blog!</h1>'


@login_required
@blog.route('/post', methods=['GET', 'POST'])
def post():
    return  render_template('blog_post.html')

