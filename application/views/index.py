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

@application.app.route('/class/')
def show_class():
    return render_template('class.html')

@application.app.route('/profile/')
def show_profile():
    """Display /profile route."""
    profile_content = application.model.get_users()
    context = {"username": profile_content[0], 
               "email": profile_content[1], 
               "profile_picture": profile_content[2]}
    return flask.render_template("profile.html", **context)