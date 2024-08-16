"""REST API for account."""
import flask
import application
from application import model

@application.app.route('/api/v1/study_group/', methods=['POST'])
def join_study_group():

    data = flask.request.get_json()
    post_id = data['course_code']

    if not model.course_exists(post_id):
        flask.abort(404, description="Course not found")

    logname = flask.session.get('logname')

    if not logname:
        context = {
            "message": "Not Found",
            "status_code": 401
        }
        return flask.jsonify(**context), 401


    model.join_course(logname, post_id)

    context = {
        "username" : logname,
        "post_id" : post_id
    }
    return flask.jsonify(**context), 201
