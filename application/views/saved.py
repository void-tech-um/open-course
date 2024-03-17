import flask, application
from flask import render_template


@application.app.route('/saved/')
def show_saved():
    return render_template('saved.html')
