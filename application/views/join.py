import flask, application
from flask import render_template

@application.app.route('/join/<username>/')
def show_join(username):
    """Display /profile route."""
    courses = application.model.get_courses_of_user(username)
    context = {"courses": courses}
    return render_template('join.html', **context)

