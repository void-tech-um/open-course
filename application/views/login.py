from flask import Flask, render_template, url_for, redirect, session, request, jsonify
from flask_oauthlib.client import OAuth
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
    return redirect(url_for('show_index'))

@application.app.route('/logout')
def logout():
    session.pop('google_token')
    return redirect(url_for('show_index'))

