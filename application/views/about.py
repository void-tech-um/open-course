import flask, application
from flask import render_template


@application.app.route('/about/')
def show_about():
    username = flask.session.get('username', None)

    return render_template('about.html', username=username)