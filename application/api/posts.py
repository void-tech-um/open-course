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
    username = flask.session.get('username')
    if not username:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    size = flask.request.args.get("size", default = 6, type=int)
    page = flask.request.args.get("page", default = 0, type=int)
    if (size <= 0) or (page < 0):
        context = {
            "message": "Bad Request",
            "status_code": 400
        }
        return flask.jsonify(**context), 400    
    post_id = model.get_max_post_id(username)
    page_lte = flask.request.args.get("postid_lte",
                                   default=post_id["post_id"], type=int)
    next = ""
    if (page + 1) <= int(page_lte / size):
        next = f"/api/v1/posts/?size={size}&page={page+1}&postid_lte={page_lte}"

    results = model.get_posts_user(username, page_lte, size, page)

    for post in results["posts"]:
        post['url'] = f"/api/v1/posts/{post['post_id']}/"

    url = flask.request.path

    if (flask.request.args.get("page") or
            flask.request.args.get("size") or
            flask.request.args.get("postid_lte")):
        url = flask.request.full_path

    context = {
        "next": next,
        "results": results["posts"],
        "url": url
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
        "email":data_user["email"],
        "title": data_post["title"],
        "description": data_post["description"],
        "course_code": data_post["course_code"],
        "created": data_post["created"],
        "schedule_link": data_post["schedule_link"],
        "type": data_post["type"],
        "location": data_post["location"],
        "tags" : tags["tags"],
        "postShowUrl": f"/api/v1/posts/{postid}/"
    }
    return flask.jsonify(**context), 200

@application.app.route('/api/v1/posts/', methods=['POST'])
def create_post():
    data = flask.request.get_json()
    print(data["course"])
    # model.create_post parameters
    # create_post(username, title, description, course_code, created, schedule_link, type)
    """
    context = {
          "message": "Not Found",
          "status_code": 404
        }
       return flask.jsonify(**context), 404
    """
    username = flask.session.get('username')
    title = data["title"]
    if title == '' or title == None:
        context = {
          "message": "Please enter a title.",
          "status_code": 404
        }
        return flask.jsonify(**context), 404
      
    
    description = data["description"]
    if description == '' or description == None:
        context = {
          "message": "Please enter a description.",
          "status_code": 404
        }
        return flask.jsonify(**context), 404

    # might need to check if the course is one of ther user's courses
    course_code = data["course"]
    if course_code == '' or course_code == None:
        context = {
          "message": "Please enter a course code.",
          "status_code": 404
        }
        return flask.jsonify(**context), 404
    schedule_link = data["scheduleLink"]
    if schedule_link == '' or schedule_link == None:
        context = {
          "message": "Please enter a schedule time.",
          "status_code": 404
        }
        return flask.jsonify(**context), 404
    location = data["location"]
    if location == '' or location == None:
        context = {
          "message": "Please enter a location.",
          "status_code": 404
        }
        return flask.jsonify(**context), 404    
    #    Removed to make more simplified
    # postType = data["type"]
    # if postType == '' or postType == None:
    #     context = {
    #       "message": "Please enter a post type.",
    #       "status_code": 404
    #     }
    #     return flask.jsonify(**context), 404

    # post = model.create_post(data["username"], data["title"], data["description"], data["course_code"], data["schedule_link"], data["type"])
    
    post = model.create_post(username, data["title"], data["description"], data["course"], data["scheduleLink"], data["location"] , data["type"])
    #Blank quote is the placeholder for schedule link
    tags = data["tags"]
    context = {
        "post_id": post["post_id"],
        "username": flask.session.get('username'), 
        "title": data["title"],
        "description": data["description"],
        "course": data["course"],
        "created": post["created"],
        "scheduleLink": data["scheduleLink"],
        "location": data["location"],
        "type": 1,
    }
    print(context)
    return flask.jsonify(**context), 201

@application.app.route('/api/v1/posts/join/<int:postid>/', methods=['POST'])
def join_post(postid):
    username = flask.session.get('username')
    if not username:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    
    post = model.join_post(postid)
    if not post:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    
    context = {
        "message": "Success",
        "status_code": 200
    }
    return flask.jsonify(**context), 200