import flask, application
from flask import render_template


@application.app.route('/course/')
def show_course():
    return render_template('course.html')