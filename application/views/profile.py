import flask, application
from flask import render_template

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""
    context = application.model.get_courses_of_user(username)
    # context = {course : [{course_code : EECS 280, course_name : INtroductory to Data structures},{course_code: EECS 370, course_name: }]}
    return render_template('profile.html', **context)
