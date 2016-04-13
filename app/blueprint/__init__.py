#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

bluepSystemPrefix='/api/_system'
bluepTopicPrefix='/api/_topics'
bluepCuserPrefix='/api/_cuser'

from .menus import *
from .dashboard import *
from .topics import *
from .cuser import *

__all__ = [
            'bluepSystemPrefix',
            'bluepTopicPrefix',
            'bluepCuserPrefix',
            'bluep_dashboard',
            'bluep_sidebarMenu',
            'bluep_header',
            'bluep_topics',
            'bluep_cuser',
           ]
