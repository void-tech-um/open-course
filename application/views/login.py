from flask import Flask, render_template, url_for, redirect, session, request, jsonify
from flask_oauthlib.client import OAuth
from application.model import connect_to_db, get_db, get_user
from .. import google, oauth
import application


@application.app.route('/show-login/')
def show_login():
    return render_template('login.html')

@application.app.route('/privacy-policy/')
def show_privacy_policy():
    return render_template('privacy-policy.html')

@application.app.route('/login')
def login():
    return google.authorize(callback=url_for('authorized', _external=True))

@application.app.route('/login/authorized')
def authorized():
    response = google.authorized_response()
    if response is None or response.get('access_token') is None:
        return 'Access denied: reason={} error={}'.format(
            request.args['error_reason'],
            request.args['error_description']
        )
    session['google_token'] = (response['access_token'], '')
    user_info = google.get('userinfo')

    # Check if the user is from umich.edu
    domain = user_info.data['hd']
    if domain != 'umich.edu':
        return 'Access denied: reason=invalid domain', 406
    #
    # Check if the user is in the database
    username = user_info.data['email'].split('@')[0]
    email = user_info.data['email']

    conn = connect_to_db()
    cur = get_db().cursor()

    # Store the username in the database
    cur.execute(
        "SELECT * FROM users WHERE username = %s",
        (username,)
    )
    user = cur.fetchone()
    if user is None:
        # User does not exist, so insert the new user
        cur.execute("INSERT INTO users (username, email, phone_num, profile_picture, bio) VALUES (%s, %s, %s, %s, %s)", (username, email, "123-456-7890", user_info.data['picture'], "None"))
        conn.commit()
        print("User inserted")
    else:
        print("User is already in the database")
    
    cur.close()

    session['username'] = username
    print(username)
    print(session['username'])
    print(session.get('username'))

    return redirect(url_for('show_index'))
    
    #return redirect(url_for('show_profile', username=username))

@application.app.route('/logout')
def logout():
    session.pop('google_token')
    session.pop('username')
    return redirect(url_for('show_index'))

