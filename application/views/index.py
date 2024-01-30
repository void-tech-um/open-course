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
    """Show profile page."""
    user_info = application.model.get_users()
    context = {"user_info": user_info}
    return render_template('profile.html', **context)

@application.app.route('/class/')
def show_class():
    return render_template('class.html')

@application.app.route('/create/')
def show_create():
    return render_template('create.html')

@application.app.route('/join/')
def show_join():
    return render_template('join.html')
