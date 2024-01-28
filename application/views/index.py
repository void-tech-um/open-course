import flask, application
from flask import render_template

@application.app.route('/')
def show_index():
    return render_template('index.html')

@application.app.route('/events/')
def show_events():
    return render_template('events.html')

@application.app.route('/posts/')
def show_posts():
    return render_template('posts.html')

@application.app.route('/profile/')
def show_profile():
    return render_template('profile.html')

@application.app.route('/class/')
def show_class():
    return render_template('class.html')

@application.app.route('/create/')
def show_create():
    return render_template('create.html')