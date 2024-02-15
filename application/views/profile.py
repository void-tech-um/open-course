import flask, application
from flask import render_template

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""
    user = application.model.get_user(username)
    context = {"username": user[0], 
               "email": user[1],
               "phone_num": user[2],
               "profile_picture": user[3],
               "bio": user[4],
               }
    return render_template('profile.html', **context)