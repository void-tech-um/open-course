import flask, application
from flask import render_template
from application import model


@application.app.route('/courses/')
def show_courses():
    username = flask.session.get('username', None)
    if not username:
        return flask.redirect(flask.url_for('show_login'))
    context = model.get_all_courses_user(username)
    context["username"] = username
    return render_template('courses.html', **context)

@application.app.route('/courses/', methods=['POST'])
def process_join():
    target_url = flask.request.args.get('target')
    print(target_url)

    if not target_url:
        target_url = flask.url_for("show_index")
    username = flask.session.get('username', None)
    course_code = flask.request.form.get('course_code')
    if course_code:
        response = model.join_course(username, course_code)
        if response["response"] != "success":
            flask.abort(409, description="User is already in the course")
    else:
        return "Error: Course code not provided", 400

    return flask.redirect(target_url)

@application.app.route('/courses/drop-course/', methods=['POST'])
def process_drop():
    target_url = flask.request.args.get('target')
    if not target_url:
        target_url = flask.url_for("show_index")
    # Assuming you're getting the current username from user session
    username = flask.session.get('username', None)
    if not username:
        # Handle not logged in case, perhaps redirect to login page
        return flask.redirect(flask.url_for('login'))
    course_code = flask.request.form.get('course_code')
    if course_code:
        response = model.drop_course(username, course_code)
        if response["response"] != "success":
            flask.abort(409, description="User is not in the course")
    else:
        return "Error: Course code not provided", 400
    return flask.redirect(target_url)

