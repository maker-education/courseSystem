#!/usr/bin/env python
"""
    ~~~~~~~~~

    Description of the module goes here...

    :copyright: (c) 2016 by Liu Wei.
"""

from . import main

@main.route('/', methods=['GET'])
def main():
    return 'main'
