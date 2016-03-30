#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g
from app.models import httpauth
import json

bluep_sidebarMenu = Blueprint('sidebarMenu', __name__)
@bluep_sidebarMenu.route('/sidebarmenu', methods=['GET', 'POST'])
@httpauth.login_required
def menu():
    json_dict = eval(open('resource/sidebarMenu/teacher.json', 'r').read())
    return jsonify({'data':json_dict})

bluep_header = Blueprint('header', __name__)
@bluep_header.route('/header', methods=['GET', 'POST'])
@httpauth.login_required
def menu():
    json_dict = eval(open('resource/header/topmenu.json', 'r').read())
    return jsonify({'menus':json_dict, "nick": g.user.nick})
