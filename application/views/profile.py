import flask, application
from flask import render_template

@application.app.route("/profile/")
def show_profile():
    """Display /profile route."""
    users = application.model.get_users()
    context = {"users": users}
    return render_template('profile.html', **context)