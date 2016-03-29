#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify
bluep_sidebarMenu = Blueprint('menu', __name__)
from app.models import httpauth
import json

@bluep_sidebarMenu.route('/sidebarmenu', methods=['GET', 'POST'])
@httpauth.login_required
def menu():
    json_dict = eval(open('resource/sidebarMenu/teacher.json', 'r').read())
    return jsonify({'data':json_dict})
