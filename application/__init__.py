"""application package initializer."""
import flask
from flask_talisman import Talisman

import os
from authlib.integrations.flask_client import OAuth
from flask import Flask, redirect, url_for, session, request, jsonify
# app is a single object used by all the code modules in this package
app = flask.Flask(__name__)  # pylint: disable=invalid-name

# Read settings from config module (insta485/config.py)
app.config.from_object('application.config')

# Overlay settings read from a Python file whose path is set in the environment
# variable INSTA485_SETTINGS. Setting this environment variable is optional.
# Docs: http://flask.pocoo.org/docs/latest/config/
#
# EXAMPLE:
# $ export INSTA485_SETTINGS=secret_key_config.py
app.config.from_envvar('APPLICATION_SETTINGS', silent=True)

secret = os.environ.get('SECRET_KEY')
app.secret_key = secret
google_client_id = os.environ.get('GOOGLE_CLIENT_ID')

if(os.environ.get('FLASK_ENV') == 'production'):
    Talisman(app, 
             force_https=True,
             content_security_policy={
                 'default-src': ["'self'"],
             },
             frame_options='DENY',  # Prevents clickjacking
             x_content_type_options='nosniff',  # Prevents MIME sniffing
             x_xss_protection='1; mode=block',  # Cross-site scripting protection
             strict_transport_security={'max-age': 31536000, 'includeSubDomains': True}
    )

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=google_client_id,
    client_secret=secret,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None, 
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    client_kwargs={'scope': 'email profile'},
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration'
)

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
import application.views  # noqa: E402  pylint: disable=wrong-import-position
import application.model
import application.api
