import flask, application
from flask import render_template


@application.app.route('/view-user-profile/')
def show_view_user_profile():
    return render_template('view-user-profile.html')