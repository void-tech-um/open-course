from flask import Flask, render_template, url_for, redirect, session, request, jsonify
from flask_oauthlib.client import OAuth
from application.model import get_user, add_user
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
    
    username = user_info.data['email'].split('@')[0]
    email = user_info.data['email']

    # Store the username in the session
    session['username'] = username

    # Check if the user is in the database
    if get_user(username) is None:
        add_user(username, email, "123-456-7890", user_info.data['picture'], "None")
        print("User added to database")
    else:
        print("User already in database")

    #return redirect(url_for('show_index'))
    
    return redirect(url_for('show_profile', username=username))

@application.app.route('/logout')
def logout():
    session.pop('google_token')
    session.pop('username')
    return redirect(url_for('show_index'))