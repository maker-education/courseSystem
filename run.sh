#!/bin/sh
gunicorn --config gunicorn.conf manage:app
