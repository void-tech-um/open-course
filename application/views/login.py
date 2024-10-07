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
    error = request.args.get('error')
    if error == 'oauth_canceled':
        return "Sign-in was canceled. Please try again."
    return render_template('privacy-policy.html')

@application.app.route('/login')
def login():
    print(url_for('authorized', _external=True))
    return google.authorize_redirect(url_for('authorized', _external=True, _scheme='https'))

@application.app.route('/login/authorized')
def authorized():
    try:
        response = google.authorize_access_token()
        print(response)
        if response is None or response.get('access_token') is None:
            print("No access token found")
            return redirect(url_for('login', error='oauth_canceled'))

        session['google_token'] = (response, '')
        user_info = google.get('https://www.googleapis.com/oauth2/v3/userinfo').json()
        print(user_info)
        email = user_info['email']

        # Check if the user is from umich.edu
        if not email.endswith('@umich.edu'):
            session.pop('google_token')
            return render_template('login.html', message='Only umich emails are allowed.')
        
        username = user_info['email'].split('@')[0]

        # Store the username in the session
        session['username'] = username

        # Check if the user is in the database
        if get_user(username) is None:
            add_user(username, email, "123-456-7890", user_info['picture'], "None")
            print("User added to database")
        else:
            print("User already in database")

        return redirect(url_for('show_index'))
    except Exception as e:
        print(f"Error during OAuth authorization: {e}")
        return redirect(url_for('login', error='oauth_failed'))
    
    #return redirect(url_for('show_profile', username=username))

@application.app.route('/logout')
def logout():
    session.pop('google_token')
    session.pop('username')
    return redirect(url_for('show_index'))