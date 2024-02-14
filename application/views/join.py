import flask, application
from flask import render_template

@application.app.route('/join/')
def show_join():
    return render_template('join.html')