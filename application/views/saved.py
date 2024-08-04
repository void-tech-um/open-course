import flask, application
from flask import render_template


@application.app.route('/saved/')
def show_saved():
    username = flask.session.get('username', None)
    
    return render_template('saved.html', username = username)
