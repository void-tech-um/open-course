import flask, application
from flask import render_template


@application.app.route('/courses/')
def show_courses():
    return render_template('courses.html')
