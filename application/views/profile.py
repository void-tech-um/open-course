"""Profile view."""

import flask
import application


# @application.app.route("/profile/<username>", methods=["GET"])
# def show_profile(username):
#     """Display /profile route."""
#     profile_content = application.model.get_profile_content(username)
#     context = {"username": profile_content[0], 
#                "email": profile_content[1], 
#                "profile_picture": profile_content[2]}
#     return flask.render_template("profile.html", **context)