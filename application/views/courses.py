import flask, application
from flask import render_template
from application import model


@application.app.route('/courses/')
def show_courses():
    username = "test"
    context = model.get_all_courses_user(username)
    context["username"] = username
    return render_template('courses.html', **context)

@application.app.route('/courses/', methods=['POST'])
def process_join():
    target_url = flask.request.args.get('target')
    if not target_url:
        target_url = flask.url_for("show_index")
    username = "test"
    course_code = flask.request.form.get('course_code')
    model.join_course(username, course_code)
    return flask.redirect(target_url)
