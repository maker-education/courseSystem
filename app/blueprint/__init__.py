#-*- coding: utf-8 -*-
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

bluepPrefix='/api/_system'
from .menus import *
from .dashboard import *

__all__ = ['bluepPrefix', 'bluepPrefix', 'bluep_sidebarMenu', 'bluep_header',
        'bluep_dashboard']
