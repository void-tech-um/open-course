import flask, application
from flask import render_template

@application.app.route('/')
def show_index():
    return render_template('index.html')

@application.app.route('/group-details/')
def show_group_details():
    return render_template('group-details.html')
