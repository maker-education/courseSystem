#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth, db, User
from datetime import datetime
from .util import *
from config import *
import os, subprocess, uuid

bluepContentPrefix='/api/_content'

bluep_content = Blueprint('content', __name__)
string_templet = '<script type="text/javascript">\r\twindow.parent.CKEDITOR.tools.\
callFunction("%s", "%s", "%s");\r</script>'

@bluep_content.route('/fileupload', methods=['POST'])
@httpauth.login_required
def postupload():
    base_path = basedir + CONTENT_IMAGE_PATH
    relat_path = '%d/%s/%s' % (g.user.id, datetime.now().strftime("%Y"),
            datetime.now().strftime("%m"))
    file_path = os.path.join(base_path, relat_path)
    if not os.path.exists(file_path):
        os.makedirs(file_path)

    funnum = request.args.get('CKEditorFuncNum')
    if not funnum: return "error"
    upload_file = request.files.get('upload')
    if not upload_file: return string_templet % (funnum, '', '没有文件')

    suffix = upload_file.filename.split('.')[-1]
    if (not suffix) or (suffix not in ['jpg', 'jpeg', 'gif', 'png', 'bmp']):
        return string_templet % (funnum, '', '文件类型无法识别')

    filename = uuid.uuid1().hex + '.' + suffix
    file_path_name = os.path.join(file_path, filename)
    upload_file.save(file_path_name)

    out, err = timeout_command('convert -resize "800x1600>" '+ file_path_name + ' ' + file_path_name , 10)
    if err: return string_templet % (funnum, '', '文件损坏')

    web_path = os.path.join(bluepContentPrefix, 'static', relat_path, filename)

    return string_templet % (funnum, web_path + '?token=' + g.token, '')

@bluep_content.route('/static/<path:file_path>/<filename>', methods=['GET'])
@httpauth.login_required
def static(file_path, filename):
    att = False
    if request.args.get('d'):
        att = True
    path = os.path.join(basedir + CONTENT_IMAGE_PATH, file_path)
    return send_from_directory(path, filename, as_attachment=att)


