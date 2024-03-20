import flask, application
from flask import render_template

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""
    context = application.model.get_user(username)
    return render_template('profile.html', **context)
