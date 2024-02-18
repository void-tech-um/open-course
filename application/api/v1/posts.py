"""REST API for posts."""
import flask
import application
from application import model

@application.app.route('/api/v1/')
def get_services():
    """Return list of services."""
    return model.get_services(), 200


@application.app.route('/api/v1/posts/')
def get_posts():
    """Return specific number of posts."""
    # TODO