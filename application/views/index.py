import flask, application
from flask import render_template

@application.app.route('/')
def show_index():
    return render_template('index.html')
