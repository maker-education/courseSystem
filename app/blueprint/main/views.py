#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import main
from flask import render_template

@main.route('/', methods=['GET'])
def main():
    navigation =({'href': '#', 'caption': u'科技启蒙', 'children': ({'href': '#', 'caption': u'6-8电子'},\
        {'href': '#', 'caption': u'9-8电子'})}, {'href': '#', 'caption': u'科技实践'}, {'href': '#', 'caption': u'科技实践'})
    title = u'科学教育'
    return  render_template('index.html', navigation = navigation, t=title)
