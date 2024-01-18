"""Post view."""

import flask
import application


@application.app.route("/posts/", methods=["GET"])
def show_posts():
    """Display /posts/ route."""
    posts_content = application.model.get_posts()
    # context = {"owner": profile_content[0],
    #            "message" : profile_content[1], 
    #            "class": profile_content[2],
    #            "created": profile_content[3]}
    # return flask.render_template("posts.html", **context)

def single_post(post_id):
    """Return the content for a single post from the database."""
    return application.model.get_post(post_id)