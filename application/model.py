"""Open Course model (database) API."""

import application
import flask
from flask import g
import hashlib
import requests
import json
import psycopg2
import os
from psycopg2.extras import DictCursor 

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

# API RELATED CALLS ------------------------------------------------------------------------------
def get_services():
    """Return services."""
    context = {
        "posts": "/api/v1/posts/",
        "url": "/api/v1/"
    }
    return flask.jsonify(context)

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
    content = {
        "username" : user[0],
        "email" : user[1],
        "phone_num": user[2],
        "profile_picture": user[3],
        "bio" : user[4]
    }
    return content

# POST RELATED DB CALLS --------------------------------------------------------------------------

def get_posts():
    """Get all posts."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts"
    )
    posts = cur.fetchall()
    #fetchall - return a list of tuples [(),()]
    #fetchone - return one tuple ()
    #[(2,test, looking, description,), ()]
    #[{"post_id" : 2, "username" : test}]
    context = []
    for post in posts:
        #(2,test, looking, description,)        
        context.append({
            "post_id" : post[0],
            "username" : post[1],
            "title" : post[2],
            "description" : post[3],
            "course_code" : post[4],
            "created" : post[5],
            "schedule_link" : post[6],
            "type" : post[7]
        })
    return context

def get_posts_user(username, page_lte, size, page):
    """Get all posts for a user."""

    cur = get_db().cursor()

    cur.execute(
        "SELECT post_id FROM posts "
        "WHERE posts.course_code IN "
        "(SELECT course_code FROM enrollments WHERE username=%s) "
        "AND post_id <= %s"
        "ORDER BY post_id DESC "
        "LIMIT %s"
        "OFFSET %s",
        (username, page_lte, size, page * size)
    )
    posts = cur.fetchall()
    content = []
    for post in posts:
        content.append({
            "post_id" : post[0]
        })
    return content

def get_max_post_id(username):
    """Get all posts for a user."""    

    cur = get_db().cursor()

    cur.execute(
        "SELECT MAX(post_id) FROM posts "
        "WHERE posts.course_code IN "
        "(SELECT course_code FROM enrollments WHERE username=%s) ",
        (username,)
    )
    post_id = cur.fetchone()
    content = {"post_id": post_id[0]}
    return content

def get_post(post_id):
    """Get all information on post using its post_id."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts WHERE post_id = %s",
        (post_id,)
    )
    post = cur.fetchone()
    #(5, test, eecs 485 study group)
    content = {
        "post_id" : post[0],
        "username" : post[1],
        "title" : post[2],
        "description" : post[3],
        "course_code" : post[4],
        "created" : post[5],
        "schedule_link" : post[6],
        "type" : post[7]
    }
    return content

def create_post(username, title, description, course_code, created, schedule_link, type):
    """Create a post"""
    cur = get_db().cursor()
    cur.execute(
        "INSERT INTO posts ('username', 'title', 'description', 'course_code', 'created', 'schedule_link', 'type') "
        "VALUES (%s, %s) ",
        (username, title, description, course_code, created, schedule_link, type)
    )
    post_id = cur.lastrowid
    cur.commit()
    cur.execute(
        "SELECT post_id, created FROM posts WHERE post_id = %s",
        (post_id,)
    )
    post = post.fetchone()
    return post


# Get all posts for a specific user for their profile page
def get_users_posts(username):
    """Get all posts from a specific user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM posts WHERE username = %s",
        (username,)
    )
    posts = cur.fetchall()
    #[{"username" : test, 5, i love void},]
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
    #[(EECS 280,),(EECS 485,)]
    context = []
    for tag in tags:
        context.append(tag[0])

    return context

def insert_tag(post_id,tag_id): 
    """Get all tags."""
    cur = get_db().cursor()
    cur.execute(
        "INSERT INTO filters ('post_id', 'tag_id') "
        "VALUES (%s, %s) ",
        (post_id, tag_id)
    )

# COURSE RELATED DB CALLS ------------------------------------------------------------------------

def get_all_course_codes():
    """Get all course codes."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM courses"
    )
    course_codes = cur.fetchall()
    course_codes_list = []
    for course in course_codes:
        course_codes_list.append({"course_code" : course[0], "course_name" : course[1]})
    context = {"courses" : course_codes_list}
    return context

def get_courses_of_user(username):
    """Get all enrollments for a specific user."""
    cur = get_db().cursor()
    cur.execute(
        "SELECT * FROM enrollments WHERE username = %s",
        (username,)
    )
    course_codes = cur.fetchall()
    return course_codes

def join_course(username, course_code):
    """Join a course."""
    conn = get_db()
    cur = conn.cursor()
    
    print("hello")
    print(course_code)
    cur.execute(
        "INSERT INTO enrollments (username, course_code) "
        "VALUES (%s, %s) ",
        (username, course_code)
    )
    conn.commit()

def get_all_courses_user(username):
    """Get all courses for user that have not been joined yet."""
    cur = get_db().cursor()
    cur.execute(
        '''
        SELECT u.course_code, u.course_name, EXISTS(
            SELECT 1
            FROM
            (SELECT course_code FROM enrollments
            WHERE username = 'test'
            ) e
            WHERE e.course_code = u.course_code
        ) AS user_in_course FROM courses u;
        ''',
        (username,)
    )
    course_codes = cur.fetchall()
    course_codes_list = []
    for course in course_codes:
        course_codes_list.append({"course_code" : course[0], "course_name" : course[1], "is_in_course" : course[2]})
    context = {"courses" : course_codes_list}

    return context

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