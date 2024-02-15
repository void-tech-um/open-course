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

# USER RELATED DB CALLS --------------------------------------------------------------------------

def get_users():
    """Get all users."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM users"
    )
    users = cur.fetchall()
    return users

# Get all information for a specific user for their profile page
def get_user(username):
    """Get all information on a single user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM users WHERE username = %s",
        (username,)
    )
    user = cur.fetchone()
    return user

# POST RELATED DB CALLS --------------------------------------------------------------------------

def get_posts():
    """Get all posts."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts"
    )
    posts = cur.fetchall()
    return posts

def get_post(post_id):
    """Get all information on post using its post_id."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts WHERE post_id = %s",
        (post_id,)
    )
    post = cur.fetchone()
    return post

def get_condensed_post_info():
    """Get a condensed version of post information."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT title, username, course_code, created FROM posts"
    )
    posts = cur.fetchall()
    return posts

# Get all posts for a specific user for their profile page
def get_users_posts(username):
    """Get all posts from a specific user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts WHERE username = %s",
        (username,)
    )
    posts = cur.fetchall()
    return posts

# TAG RELATED DB CALLS --------------------------------------------------------------------------

def get_all_tags(): 
    """Get all tags."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM tags"
    )
    tags = cur.fetchall()
    return tags

# Get tags for a specific posts (likely for viewing a post and its associated filters)
def get_tags_for_post(post_id):
    """Get all tags for a specific post."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT t.tag_name FROM filters f JOIN tags t ON f.tag_id = t.tag_id WHERE f.post_id = %s",
        (post_id,)
    )
    tags = cur.fetchall()
    return tags

# COURSE RELATED DB CALLS ------------------------------------------------------------------------

def get_all_course_codes():
    """Get all course codes."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM course_codes"
    )
    course_codes = cur.fetchall()
    return course_codes

def get_courses_of_user(username):
    """Get all enrollments for a specific user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM enrollments WHERE username = %s",
        (username,)
    )
    course_codes = cur.fetchall()
    return course_codes



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