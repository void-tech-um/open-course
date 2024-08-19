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
    courses = model.get_courses_of_user(username)
    posts = model.get_posts_created_by_user(username)   
    # need a separate area for get_users_posts
    is_own_profile = flask.session.get('username') == username

    context = {"username": user["username"], 
               "email": user["email"],
               "phone_num": user["phone_num"],
               "profile_pic": user.get("profile_picture"),
               "bio": user['bio'],
               "courses": courses,
               "posts" : posts,
               "is_own_profile": is_own_profile
               }
    return flask.jsonify(**context), 200

@application.app.route('/api/v1/profile/<username>/edit/', methods=["POST"])
def edit_profile(username):
    """Update user profile data."""
    logged_in_user = flask.session.get('username')
    if logged_in_user != username:
        return flask.jsonify({"error": "Permission denied"}), 403

    bio = flask.request.form.get('bio')
    phone_num = flask.request.form.get('phone-num')
    
    if len(bio) > 100:
        return flask.jsonify({"error": "Bio exceeds character limit"}), 400
    
    if len(phone_num) > 20:
        return flask.jsonify({"error": "Phone number exceeds character limit"}), 400

    model.update_bio(bio, phone_num, username)
    return flask.jsonify({"message": "Profile updated successfully"}), 200

@application.app.route('/api/v1/profile/<username>/delete/', methods=["POST"])
def delete_post():
    """Delete a user post."""
    username = flask.session.get('username')
    if not username:
        return flask.jsonify({"error": "User not logged in"}), 401

    post_id = flask.request.form.get('post_id')
    if post_id:
        model.delete_post(username, post_id)
        return flask.jsonify({"message": "Post deleted successfully"}), 200
    else:
        return flask.jsonify({"error": "Post ID not provided"}), 400


