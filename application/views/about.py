import flask, application
from flask import render_template


@application.app.route('/about/')
def show_about():
    return render_template('about.html')