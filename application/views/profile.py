import flask, application
from flask import render_template
import hashlib
import uuid
import pathlib
import boto3
import os

@application.app.route("/profile/<username>/")
def show_profile(username):
    """Display /profile route."""
    context = application.model.get_user(username)

    return render_template('profile.html', **context)


def add_item():
    """Add item for online shopping."""
    if 'username' not in flask.session:
        flask.abort(403)
    try:
        name = flask.request.form['name']
        description = flask.request.form['description']
        width = flask.request.form['width']
        price = flask.request.form['price']
        fileobj = flask.request.files['image']
        category = flask.request.form['category']
    except KeyError:
        flask.abort(400)

    filename = fileobj.filename
    if name == '' or description == '' or price == '' or filename == '' \
        or category == '' or category == 'Choose a category':
        flask.abort(400)

    stem = uuid.uuid4().hex
    suffix = pathlib.Path(filename).suffix.lower()
    uuid_basename = f"{stem}{suffix}"

    access_key = os.environ.get('AWS_ACCESS_KEY')
    secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('S3_BUCKET_NAME')

    # Save to content delivery network
    s3 = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)
    s3.upload_fileobj(fileobj, bucket_name, uuid_basename)
    # insert into the items database with the info
    conn = application.model.get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO items "
        "(name, description, width, price, image, category) "
        "VALUES (%s, %s, %s, %s, %s, %s)",
        (name, description, width, price, uuid_basename, category)
    )
    conn.commit()


def edit_item():
    """Make an edit to a currently existing item."""
    if 'username' not in flask.session:
        flask.abort(403)
    try:
        itemid = flask.request.form['edit-itemid']
        name = flask.request.form['name']
        description = flask.request.form['description']
        width = flask.request.form['width']
        price = flask.request.form['price']
        fileobj = flask.request.files['image']
        category = flask.request.form['category']
    except KeyError:
        flask.abort(400)

    filename = fileobj.filename
    if itemid == '' or name == '' or description == '' or price == '' \
        or category == '' or category == 'Choose a category':
        flask.abort(400)

    conn = application.model.get_db()
    uuid_basename = ''
    if filename == '':
        cur1 = conn.cursor()
        cur1.execute(
            "SELECT image FROM items WHERE itemid = %s",
            (itemid,)
        )
        img_name = 
        uuid_basename = img_name

    if filename != '':
        access_key = os.environ.get('AWS_ACCESS_KEY')
        secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
        bucket_name = os.environ.get('S3_BUCKET_NAME')
        # Delete from content delivery network
        cur2 = conn.cursor()
        cur2.execute(
            # "SELECT image FROM items WHERE itemid = %s",
            # (itemid,)
        )
        img_name = cur2.fetchone()[0]
        s3 = boto3.resource('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)
        bucket = s3.Bucket(bucket_name)
        bucket.Object(img_name).delete()
        stem = uuid.uuid4().hex
        suffix = pathlib.Path(filename).suffix.lower()
        uuid_basename = f"{stem}{suffix}"
        s3_client = boto3.client('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)
        s3_client.upload_fileobj(fileobj, bucket_name, uuid_basename)
    # insert into the items database with the info
    cur3 = conn.cursor()
    cur3.execute(
        # "UPDATE items "
        # "SET name = %s, description = %s, width = %s, price = %s, image = %s, category = %s "
        # "WHERE itemid = %s",
        # (name, description, width, price, uuid_basename, category, itemid)
    )
    conn.commit()


def delete_item():
    """Delete an item from online store."""
    if 'username' not in flask.session:
        flask.abort(403)
    try:
        itemid = flask.request.form['delete-itemid']
    except KeyError:
        flask.abort(400)
    if itemid == '':
        flask.abort(400)

    # Get the filename from the database
    conn = application.model.get_db()
    cur1 = conn.cursor()
    cur1.execute(
        
    )
    img_name = 

    # Delete from content delivery network
    access_key = os.environ.get('AWS_ACCESS_KEY')
    secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('S3_BUCKET_NAME')
    s3 = boto3.resource('s3', aws_access_key_id=access_key, aws_secret_access_key=secret_access_key)
    bucket = s3.Bucket(bucket_name)
    bucket.Object(img_name).delete()
    # insert into the items database with the info
    cur2 = conn.cursor()
    cur2.execute(
        
    )
    conn.commit()