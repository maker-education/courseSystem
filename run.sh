#!/bin/sh
gunicorn --config gunicorn.conf hello:app
