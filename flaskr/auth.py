import functools
import uuid
import hashlib
from datetime import datetime

from flask import (
    jsonify, Blueprint, request, session, g
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import User

tokens = dict()
user_token = dict()

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    """     For new user to register    """
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        error = None
        success_code = 200
        error_code = 400

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'

        elif User.objects(uname=username) is not None:
            error = 'User {} is already registered.'.format(username)

        elif User.objects(email=email) is not None:
            error = 'Email {} is already registered.'.format(email)

        if error is None:
            new_user = User(uid=uuid.uuid4(), uname=username, \
                            password=generate_password_hash(password), \
                            level=2, email=email, regist_date=datetime.now())
            new_user.save()
            return jsonify({
                'data' : None,\
                'message': f'User {username} registers success!'
                }), success_code

    return jsonify({
                'data' : None, \
                'message': error
                }), error_code


@bp.route('/login', methods=['POST'])
def login():
    '''     For user login      '''

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        error = None
        success_code = 200
        error_code = 400

        user = User.objects(uname=username).first()

        if user is None:
            error = 'Incorrect username.'

        elif not check_password_hash(user.password, password):
            error = 'Incorrect password.'

        if error is None:
            session['user_id'] = user.uid
            user.last_login = datetime.now()
            # md5 = hashlib.md5()
            # user_str = user.uname + datetime.now().strftime('%m/%d/%Y %H:%M:%S')
            # md5.update(s.encode('utf-8'))
            # auth_token = md5.hexdigest()
            # if user_token.get(user.uid) is None:
            #     user_token[user.uid] = auth_token
            #     tokens[auth_token] = user.uid
            # else:
            #     del tokens[user_token[user.uid]]
            #     user_token[user.uid] = auth_token
            #     tokens[auth_token] = user.uid
            return jsonify({
                'data' : {
                    'name': user.uname,\
                    'display_name': user.display_name,\
                    # 'token': auth_token
                }, \
                'message': f'User {username} log in success!'
                }), success_code

    return jsonify({
                'data' : None, \
                'message': error
                }), error_code


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = User.objects(uid=user_id).first()
        print(f'Hello {g.user.uname}')
  
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return  jsonify({
                        'data' : None,
                        'message': 'Auth error'
                    }), 401
        return view(**kwargs)

    return wrapped_view


def user_logging(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        print(view)
        print(**kwargs)
        return view(**kwargs)

    return wrapped_view

def admin_only(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None or g.user.level > 0:
            return  jsonify({
                        'data' : None,
                        'message': 'Auth error'
                    }), 401
        return view(**kwargs)

    return wrapped_view

    
@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    '''     For user log out    '''

    if request.method == 'POST':
        session.clear()
        # token = request.form['token']
        # del user_token[tokens[token]]
        # del tokens[token]
        return jsonify({
            'data' : None,
            'message': 'Log out success!'
        }), 203
