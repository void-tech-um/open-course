import flask, application
from flask import render_template


@application.app.route('/posts/')
def show_posts():
    return render_template('posts.html')