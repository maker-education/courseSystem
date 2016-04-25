#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from flask import Blueprint, jsonify, g, request, send_from_directory, render_template
from app.models import httpauth, db, User
from config import *
import os, subprocess
from datetime import datetime

bluep_content = Blueprint('content', __name__)
string_templet = '<script type="text/javascript">\r\twindow.parent.CKEDITOR.tools.\
callFunction("%s", "%s", "%s");\r</script>'

@bluep_content.route('/fileupload', methods=['POST'])
@httpauth.login_required
def postupload():
    file_path = os.path.join(basedir, CONTENT_IMAGE_PATH, '%d' % g.user.id, )
    file_path = os.path.join( file_path, datetime.now().strftime("%Y"), datetime.now().strftime("%m"))
    funnum = request.args.get('CKEditorFuncNum')
    if not funnum: return "error"
    upload_file = request.files.get('upload')
    if not upload_file: return string_templet % (funnum, '', '没有文件')

    print file_path
    print request.files.get('upload')
    print string_templet % (funnum, '', '错误')
    #({'answer':'File transfer completed'})
    return string_templet % (funnum, '', '错误')
    if not os.path.exists( file_path ):
        pass

    fname = (f.filename) #获取一个安全的文件名，且仅仅支持ascii字符；
    if (fname in [TOPIC_INIT_FILE_NAME, TOPIC_PPT_FILE_NAME] ):
        return jsonify({'error_info':'文件名和系统冲突错误'})

    if (os.path.exists(fname)):
        return jsonify({'error_info':'文件存在或和知识点冲突'})

    f.save(os.path.join(TOPIC_DIR, topic_name, fname))
    return jsonify({'answer':'File transfer completed'})

