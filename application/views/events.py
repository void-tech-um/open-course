import flask, application
from flask import render_template

@application.app.route('/events/')
def show_events():
    return render_template('events.html')


