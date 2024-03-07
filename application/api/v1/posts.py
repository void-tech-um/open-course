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
    data_user = model.get_user(data_post["username"])
    tags = model.get_tags_for_post(postid)
    # TODO
    # Need to get the number of users in a group depending on the type of post
    # Allow users to join a group
    
    context = {
        "post_id": postid,
        "imgUrl": data_user["profile_picture"],
        "username": data_post["username"],
        "title": data_post["title"],
        "description": data_post["description"],
        "course_code": data_post["course_code"],
        "created": data_post["created"],
        "schedule_link": data_post["schedule_link"],
        "type": data_post["type"],
        "tags" : tags
    }
    return flask.jsonify(**context), 200

@application.app.route('/api/v1/posts/', methods=['POST'])
def create_post():

    data = flask.request.get_json()
    
    post = model.create_post(data["username"], data["title"], data["description"], data["course_code"], data["schedule_link"], data["type"])
    tags = data["tags"]

    filters_list = []
    for tag in tags:
        model.insert_tag(post["post_id"], tag)
        filters_list.append({
            "post_id" : post["post_id"],
            "tag_id" : tag
        })
    
    context = {
        "post_id": post["post_id"],
        "username": data["username"],
        "title": data["username"],
        "description": data["description"],
        "course_code": data["course_code"],
        "created": post["created"],
        "schedule_link": data["schedule_link"],
        "type": data["type"],
        "filters" : filters_list
    }
    return flask.jsonify(**context), 201


