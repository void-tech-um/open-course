import flask, application
from flask import render_template
from application import model


@application.app.route('/courses/')
def show_courses():
    courses = model.get_all_course_codes()
    return render_template('courses.html', courses=courses)
