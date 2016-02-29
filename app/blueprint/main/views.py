#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import main
from flask import render_template
from flask.ext.security import login_required

@main.route('/', methods=['GET'])
@login_required
def main():
    return 'hello world'
    return  render_template('index.html')
