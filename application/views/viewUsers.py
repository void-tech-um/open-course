import flask, application
from flask import render_template


@application.app.route('/viewUsers/')
def show_view_users():
    return render_template('viewUsers.html')