import flask, application
from flask import render_template


@application.app.route('/create/')
def show_create():
    return render_template('create.html')