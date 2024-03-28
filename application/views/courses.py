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

@application.app.route('/courses/drop-course/', methods=['POST'])
def process_drop():
    # Assuming you're getting the current username from user session
    # TODO get username from session
    # username = flask.session.get('username', None)
    username = 'test'
    if not username:
        # Handle not logged in case, perhaps redirect to login page
        return flask.redirect(flask.url_for('login'))

    course_code = flask.request.form.get('course_code')
    if course_code:
        model.drop_course(username, course_code)
        return flask.redirect(flask.url_for("show_profile", username=username))
    else:
        return "Error: Course code not provided", 400
