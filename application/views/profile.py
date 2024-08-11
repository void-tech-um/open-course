import flask, application
from flask import render_template, url_for
from .. import google

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""

    profile_data = application.model.get_user(username)
    context = application.model.get_courses_of_user(username)
    post = application.model.get_posts_created_by_user(username)
    context["profile_pic"] = profile_data.get("profile_picture")
    context["username"] = username
    context["email"] = profile_data['email']
    context["bio"] = profile_data['bio']
    context["phone_num"] = profile_data['phone_num']
    context["flask_username"] = flask.session.get('username', None)
    if flask.session.get('username') != username:
        context["is_own_profile"] = False
    else:
        context["is_own_profile"] = True
    return render_template('profile.html', **context, **post)

@application.app.route("/profile/<username>/edit/", methods=["POST"])
def edit_profile_bio(username):
    """Make an edit to a user's profile bio."""
    logged_in_user = flask.session.get('username', None)
    if not username:
        return flask.redirect(url_for('login'))
    if logged_in_user != username:
        flask.abort(403, description="You do not have permission to edit this profile.")
    try:
        bio = flask.request.form['bio']
        phone_num = flask.request.form['phone-num']
    except KeyError:
        flask.abort(400)

    if len(bio) > 100:
        flask.abort(400, description="Bio exceeds the character limit of 300 characters.")

    if len(phone_num) > 20:
        flask.abort(400, description="Phone number exceeds the character limit of 15 characters.")
    

    conn = application.model.get_db()
    # insert into the database with the updated bio info
    cur = conn.cursor()
    cur.execute(
        "UPDATE users "
        "SET bio = %s, phone_num = %s "
        "WHERE username = %s",
        (bio, phone_num, username)
    )
    conn.commit()
    return flask.redirect(flask.url_for("show_profile", username=username))

@application.app.route("/profile/delete/", methods=["POST"])
def delete_post():
    # Assuming you're getting the current username from user session
    username = flask.session.get('username', None)
    if not username:
        # Handle not logged in case, perhaps redirect to login page
        return flask.redirect(flask.url_for('login'))
    post_id = flask.request.form.get('post_id')
    if post_id:
        application.model.delete_post(username, post_id)
        return flask.redirect(flask.url_for("show_profile", username=username))
    else:
        return "Error: Post ID not provided", 400