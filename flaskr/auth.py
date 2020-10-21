import functools
import uuid
import hashlib
import json
from datetime import datetime

from flask import (
    jsonify, Blueprint, request, session, g
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import User, CategoryNode

tokens = dict()
user_token = dict()

bp = Blueprint('auth', __name__, url_prefix='/auth')

def user_logging(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        response = view(**kwargs)

        method = {
            'GET': '瀏覽',
            'POST' : '新增',
            'PUT' : '更新',
            'DELETE': '刪除'
        }
        
        LEVEL = {
            'GET': 0, 
            'POST' : 1,
            'PUT' : 1,
            'DELETE': 1
        }

        user = g.user
        username = 'Guest' if user is None else user.uname
        user_ip = request.host
        action_time = datetime.now().strftime("%Y-%m-%d %H:%M")
        action_part = request.path
        action = method[request.method]
        level = LEVEL[request.method] if response[1] / 100  < 5 else 2
        print_level = 'INFO' if level == 0 else 'WARN' if level == 1 else 'ERROR'
        request_failed = '成功' if response[1] / 100 < 3 else '失敗'
        
        if request.blueprint == 'auth':
            if request.endpoint == 'auth.login':
                action_part = ''
                action = '登入'
            elif request.endpoint == 'auth.logout':
                action_part = ''
                action = '登出'

            
        elif request.blueprint == 'cat':
            if request.endpoint == 'cat.category_api':
                args = action_part.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    if part == '':
                        action_part = '全部類別'
                    elif cat is not None:
                        action_part = cat.cname +' 類別'
                    else:
                        action_part = '未定義類別'
                    if request.method == 'POST':
                        action_part = request.form['cname']
                    
            elif request.endpoint == 'cat.category_seeds_api':
                args = action_part.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    if part == 'seeds':
                        action_part = '全部類別的種子'
                    elif cat is not None:
                        action_part = cat.cname +' 類別的種子'
                    else:
                        action_part = '未定義類別'
                    if request.method == 'POST' or request.method == 'DELETE':
                        action_part = cat.cname +'的種子 ' + request.form['seeds']
                    
            elif request.endpoint == 'cat.category_terms_api':
                args = action_part.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    if part == 'seeds':
                        action_part = '全部類別的種子'
                    elif cat is not None:
                        action_part = cat.cname +' 類別的種子'
                    else:
                        action_part = '未定義類別'
                    if request.method == 'POST' or request.method == 'DELETE':
                        action_part = cat.cname +'的詞 ' + request.form['terms']
            elif request.endpoint == 'cat.getCategoryStat':
                action_part = '目前類別狀態'
        else:
            pass

        print(f'[{print_level}] User {username} {action} {action_part} {request_failed} @ {action_time} from {user_ip}')
        
        return response
    return wrapped_view

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
@user_logging
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
            g.user = user
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
@user_logging
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
