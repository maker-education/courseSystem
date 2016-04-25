#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

bluepSystemPrefix='/api/_system'
bluepTopicPrefix='/api/_topics'
bluepCuserPrefix='/api/_cuser'
bluepBasePrefix='/api/_user'
bluepContentPrefix='/api/_content'

from .menus import *
from .dashboard import *
from .topics import *
from .cuser import *
from .postupload import *
from ._user import *

__all__ = [
            'bluepSystemPrefix',
            'bluepTopicPrefix',
            'bluepCuserPrefix',
            'bluepBasePrefix',
            'bluepContentPrefix',
            'bluep_dashboard',
            'bluep_sidebarMenu',
            'bluep_header',
            'bluep_topics',
            'bluep_cuser',
            'bluep_users',
            'bluep_content',
           ]
