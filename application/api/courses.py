"""REST API for account."""
import flask
import application
from application import model

@application.app.route('/api/v1/course/', methods=['POST'])
def join_course():

    data = flask.request.get_json()
    course_code = data['course_code']
    logname = flask.session.get('logname')

    #Check to see if course exist?

    model.join_course(logname, course_code)

    context = {
        "username" : logname,
        "course_code" : course_code
    }
    return flask.jsonify(**context), 201

@application.app.route('/api/v1/courses/', methods=['GET'])
def get_courses():
    username = flask.session.get('username', None)
    if not username:
        context = {
            "message": "Unauthorized: No username in session",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    courses = model.get_courses_of_user(username)

    return flask.jsonify(**courses), 200

@application.app.route('/api/v1/tags/', methods=['GET'])
def get_tags():
    tags = model.get_all_tags()
    return flask.jsonify(**tags), 200
