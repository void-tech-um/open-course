"""REST API for posts."""
import flask
import application
from application import model

@application.app.route('/api/v1/')
def get_services():
    """Return list of services."""
    return model.get_services(), 200


@application.app.route('/api/v1/posts/', methods=["GET"])
def get_posts():
    """Return specific number of posts."""
    # TODO
    

    size = flask.request.args("size", default = 10, type=int)
    page = flask.request.args("page", default = 0, type=int)
    data = model.get_posts()


    context = {

    }
    return flask.jsonify(**context)

@application.app.route('/api/v1/posts/<int:postid>/', methods=['GET'])
def get_specific_post(postid):

    data_post = model.get_post(postid)
    if not data_post:
       context = {
          "message": "Not Found",
          "status_code": 404
        }
       return flask.jsonify(**context), 404
    data_user = model.get_user(data_post.username)
    
    context = {
        "postShowUrl": data_post.postShowUrl,
        "imgUrl": data_post.imgUrl,
        "owner": data_post.username,
    }
