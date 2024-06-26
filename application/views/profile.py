import flask, application
from flask import render_template

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""
    profile_data = application.model.get_user(username)
    context = application.model.get_courses_of_user(username)
    post = application.model.get_posts_created_by_user(username)
    context["posts"] = post["posts"]
    # context = {course : [{course_code : EECS 280, course_name : INtroductory to Data structures},{course_code: EECS 370, course_name: }],
    #           posts : [{post_id: 4, title: "hi"}]}
    return render_template('profile.html', **context, profile_data=profile_data)

@application.app.route("/profile/<username>/edit/", methods=["POST"])
def edit_profile_bio(username):
    """Make an edit to a user's profile bio."""
    # TODO uncomment this out once the username is stored in the flask session!
    # if 'username' not in flask.session:
    #     flask.abort(403)
    try:
        bio = flask.request.form['bio']
        phone_num = flask.request.form['phone-num']
    except KeyError:
        flask.abort(400)

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
    return flask.redirect(f"/profile/{username}/")

@application.app.route("/profile/delete/", methods=["POST"])
def delete_post():
    # Assuming you're getting the current username from user session
    # TODO get username from session
    # username = flask.session.get('username', None)
    username = 'test'
    if not username:
        # Handle not logged in case, perhaps redirect to login page
        return flask.redirect(flask.url_for('login'))
    post_id = flask.request.form.get('post_id')
    print(post_id)
    if post_id:
        application.model.delete_post(username, post_id)
        return flask.redirect(flask.url_for("show_profile", username=username))
    else:
        return "Error: Post ID not provided", 400