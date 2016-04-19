#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""


def list_get(l, name):
    for i in l:
        if (i.get('name')) and (i.get('name') == name): return i.get('value')
    return None


