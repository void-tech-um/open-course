"""REST API for account."""
import flask
import application
from application import model

@application.app.route('/api/v1/course/', methods=['POST'])
def join_course():
    data = flask.request.get_json()
    course_code = data['course_code']
    username = flask.session.get('username', None)

    if not username:
        return flask.jsonify({
            "message": "Unauthorized: No username in session",
            "status_code": 401
        }), 401

    response = model.join_course(username, course_code)
    if response["response"] != "success":
        return flask.jsonify({
            "message": "User is already in the course",
            "status_code": 409
        }), 409

    context = {
        "username" : username,
        "course_code" : course_code
    }

    return flask.jsonify(**context), 201

@application.app.route('/api/v1/course/drop/', methods=['POST'])
def drop_course():
    data = flask.request.get_json()
    course_code = data['course_code']
    username = flask.session.get('username', None)

    if not username:
        return flask.jsonify({
            "message": "Unauthorized: No username in session",
            "status_code": 401
        }), 401

    if not course_code:
        return flask.jsonify({
            "message": "Course code not provided",
            "status_code": 400
        }), 400

    response = model.drop_course(username, course_code)
    if response["response"] != "success":
        return flask.jsonify({
            "message": "User is not in the course",
            "status_code": 409
        }), 409

    context = {
        "username" : username,
        "course_code" : course_code
    }

    return flask.jsonify(**context), 200



@application.app.route('/api/v1/courses/', methods=['GET'])
def get_courses():
    username = flask.session.get('username', None)
    if not username:
        context = {
            "message": "Unauthorized: No username in session",
            "status_code": 401
        }
        return flask.jsonify(**context), 401
    courses = model.get_courses_of_user(username)
    if courses is None:
        return flask.jsonify({
            "message": "Courses not found",
            "status_code": 404
        }), 404

    return flask.jsonify(**courses), 200
    # return flask.jsonify({
    #     "courses": courses,
    #     "username": username
    # }), 200

@application.app.route('/api/v1/tags/', methods=['GET'])
def get_tags():
    tags = model.get_all_tags()
    return flask.jsonify(**tags), 200

