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