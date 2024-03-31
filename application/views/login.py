import flask, application
from flask import render_template

@application.app.route('/login')
def show_login():
    return render_template('login.html')
