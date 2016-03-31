#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

bluepSystemPrefix='/api/_system'
bluepTopicPrefix='/api/_topics'

from .menus import *
from .dashboard import *
from .topics import *

__all__ = [
            'bluepSystemPrefix',
            'bluepTopicPrefix',
            'bluep_dashboard',
            'bluep_sidebarMenu',
            'bluep_header',
            'bluep_topics',
           ]
