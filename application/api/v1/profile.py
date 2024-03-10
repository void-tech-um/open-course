"""REST API for account."""
import flask
import application
from application import model

@application.app.route('/api/v1/profile/<username>/', methods=['GET'])
def show_profile(username):
    """Display /profile route."""
    user = model.get_user(username)
    if not user:
        context = {
            "message": "Not Found",
            "status_code": 404
        }
        return flask.jsonify(**context), 404
    posts = model.get_users_posts
    posts_list = []
    for post in posts:
        posts_list.append({
            "post_id": post["postid"],
            "title": post["title"],
            "description": post["description"],
            "course_code": post["course_code"],
            "created": post["created"],
            "schedule_link": post["schedule_link"],
            "type": post["type"]
        })
    context = {"username": user["username"], 
               "email": user["email"],
               "phone_num": user["phone_num"],
               "profile_picture": user["profile_picture"],
               "posts" : posts_list
               }
    return flask.jsonify(**context), 200
