#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""
from datetime import datetime
import subprocess, time, re


_TIMEFORMAT = '%Y-%m-%d %H:%M:%S'

def list_get(l, name):
    if isinstance(l, list):
        for i in l:
            if (i.get('name')) and (i.get('name') == name): return i.get('value')
    return {}


def formateTime(t):
    if isinstance(t, datetime):
        return t.strftime(_TIMEFORMAT)
    return None


def timeout_command(command, timeout):
    start = datetime.now()
    process = subprocess.Popen(command, bufsize=10000, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, close_fds=True, shell=True)
    while process.poll() is None:
        time.sleep(0.1)
        now = datetime.now()
        if (now - start).seconds > timeout:
            try:
                process.terminate()
            except Exception,e:
                return 'error'
            return 'error'
    out = process.communicate()
    if process.stdin:
        process.stdin.close()
    if process.stdout:
        process.stdout.close()
    if process.stderr:
        error = process.stderr
        process.stderr.close()
    try:
        process.kill()
    except OSError:
        pass
    return out


def drop_html(s, n):
    dr = re.compile(r'<[^>]+>',re.S)
    dd = dr.sub('',s[0: n + 500])
    return dd[0:n]


