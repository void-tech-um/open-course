"""Open Course model (database) API."""

import application
import flask
from flask import g
import hashlib
import requests
import json
import psycopg2
import os

from dotenv import load_dotenv
load_dotenv()

def connect_to_db():
    """Open a new database connection.
    Flask docs:
    https://flask.palletsprojects.com/en/1.0.x/appcontext/#storing-data
    """
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST'),
        database=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        port=os.environ.get('DB_PORT')
    )
    return conn

def get_db():
    """Get the database once connected."""
    if 'db' not in g:
        g.db = connect_to_db()
    return g.db

@application.app.teardown_appcontext
def close_db(error):
    """Close the database at the end of a request.

    Flask docs:
    https://flask.palletsprojects.com/en/1.0.x/appcontext/#storing-data
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()

def get_users():
    """Get all users."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT username FROM users"
    )
    users = cur.fetchall()
    return users

def get_user(username):
    """Get user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT username FROM users WHERE username = ?",
        (username,)
    )
    user = cur.fetchone()
    return user

def get_posts():
    """Get all posts."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts"
    )
    posts = cur.fetchall()
    return posts

def get_post(post_id):
    """Get post."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT post_id FROM posts WHERE post_id = ?",
        (post_id,)
    )
    post = cur.fetchone()
    return post

def get_profile_content(username):
    """Get profile content."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT username, email, profile_picture FROM users WHERE username = ?", 
        (username,)
    )
    profile_content = cur.fetchall()
    return profile_content

def get_post_user(owner):
    """Get post from user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT message,class,created FROM posts WHERE owner = ?",
        (owner,)
    )
    posts = cur.fetchone()
    return posts


class InvalidUsage(Exception):
    """Custom exception class for invalid usage of API."""

    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """Initialize exception."""
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Return dictionary representation of exception."""
        representation = dict(self.payload or ())
        representation['message'] = self.message
        representation['status_code'] = self.status_code
        return representation


@application.app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """Handle invalid usage of API."""
    response = flask.jsonify(error.to_dict())
    response.status_code = error.status_code
    return response