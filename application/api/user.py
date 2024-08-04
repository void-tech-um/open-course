"""REST API for account."""
import flask
import application
from application import model

@application.app.route('/api/v1/user/', methods=['GET'])
def get_user_info():
    """Get user in current session info."""
    username = flask.session.get('username', None)
    if not username:
        context = {
            "message": "Unauthorized: No username in session",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    user_info = model.get_user(username)
    if not user_info:
        context = {
            "message": "User not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    print(user_info)
    return flask.jsonify(**user_info), 200
