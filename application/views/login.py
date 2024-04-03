import flask, application
from flask import render_template

@application.app.route('/login/')
def show_login():
    return render_template('login.html')

@application.app.route('/privacy-policy/')
def show_privacy_policy():
    return render_template('privacy-policy.html')
