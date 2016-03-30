#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from flask import Blueprint, jsonify, g
from app.models import httpauth
import json

bluep_dashboard = Blueprint('dashboard', __name__)
@bluep_dashboard.route('/dashboard', methods=['GET', 'POST'])
@httpauth.login_required
def dashboard():
    topics = 0
    courses = 0
    students = 0
    dashboard = {"status": 
                     [{"color":"purple",
                       "icon": "fa-line-chart",
                       "num": topics,
                       "desc": "知识点数"
                         },
                      {"color":"blue",
                       "icon": "fa-bar-chart",
                       "num": courses,
                       "desc": "课程数"
                          },
                      {"color":"green",
                       "icon": "fa-globe",
                       "num": students,
                       "desc": "学生人数"
                          }]
                }
    return jsonify(dashboard)


