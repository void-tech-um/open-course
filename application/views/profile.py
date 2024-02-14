import flask, application
from flask import render_template

@application.app.route("/profile/<username>")
def show_profile(username):
    """Display /profile route."""
    user = application.model.get_user(username)
    context = {"user": user}
    return render_template('profile.html', **context)