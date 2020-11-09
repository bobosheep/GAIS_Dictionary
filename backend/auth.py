import functools
import uuid
import hashlib
import json
from datetime import datetime

from flask import (
    jsonify, Blueprint, request, session, g
)
from werkzeug.security import check_password_hash, generate_password_hash

from backend.db import User, CategoryNode, UserLog

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

        user_ip = request.host
        action_time = datetime.now()
        action_part_str = request.path
        action = method[request.method]
        level = LEVEL[request.method] if response[1] / 100  < 5 else 2
        print_level = 'INFO' if level == 0 else 'WARN' if level == 1 else 'ERROR'
        stat = True if response[1] / 100 < 3 else False
        request_failed = '成功' if stat else '失敗'
        user = g.user
        username = 'Guest' if user is None else user.uname
        action_part = None
        
        if request.blueprint == 'auth':
            if request.endpoint == 'auth.login':
                action_part_str = ''
                action = '登入'
            elif request.endpoint == 'auth.logout':
                action_part_str = ''
                action = '登出'

            
        elif request.blueprint == 'cat':
            if request.endpoint == 'cat.category_api':
                args = action_part_str.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    if part == '':
                        action_part_str = '全部類別'
                    elif cat is not None:
                        action_part_str = cat.cname +'類別'
                    else:
                        action_part = None
                        action_part_str = '未定義類別'


                        if request.method == 'POST':
                            # add new category
                            action_part_str = request.form['cname']
                    
            elif request.endpoint == 'cat.category_seeds_api':
                args = action_part_str.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    action_part = cat
                    
                    if part == 'seeds':
                        action_part_str = '全部類別的種子'
                    elif cat is not None:
                        action_part_str = cat.cname +'類別的種子'
                        if request.method == 'POST':
                            action_part_str = cat.cname +'的種子 ' + request.form['seeds']
                        elif request.method == 'DELETE':
                            action_part_str = cat.cname +'的種子 ' + request.args['seeds']
                    else:
                        action_part_str = '未定義類別'

            elif request.endpoint == 'cat.category_terms_api':
                args = action_part_str.split('/')
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    action_part = cat

                    if part == 'seeds':
                        action_part_str = '全部類別的詞'
                    elif cat is not None:
                        action_part_str = cat.cname +'類別的詞'
                        if request.method == 'POST':
                            action_part_str = cat.cname +'的詞 ' + request.form['terms']
                        elif request.method == 'DELETE':
                            action_part_str = cat.cname +'的詞 ' + request.args['terms']
                    else:
                        action_part_str = '未定義類別'

            elif request.endpoint == 'cat.getCategoryStat':
                action_part_str = '目前類別狀態'
        elif  request.blueprint == 'extension':
            if request.endpoint == 'extension.extension_api':
                args = action_part_str.split('/')
                action = '擴展'
                if len(args) > 2:
                    part = args[2] 
                    cat = CategoryNode.objects(cid=part).first()
                    action_part = cat
                    
                    if cat is not None:
                        action_part_str = cat.cname +'類別的詞'
                    else:
                        action_part_str = '未定義類別'
                else :
                    action_part_str = '所有類別'
            elif request.endpoint == 'extension.getTermSim':
                action = '獲取'
                term = request.args['term']
                action_part_str = f'{term}的相關詞'
            pass

        print(f'[{print_level}] User {username} {action} {action_part_str} {request_failed} @ {action_time.strftime("%Y-%m-%d %H:%M")} from {user_ip}')
        description = f'\"{username}\"{action}<{action_part_str}>{request_failed}@{action_time}從 ip:{user_ip}。'
        userlog = UserLog(  log_id=str(uuid.uuid4())[:8], level=level, action=action, 
                            action_time=action_time, 
                            action_part=action_part, 
                            action_stat=stat, 
                            action_description=description,
                            user=g.user, user_ip=user_ip)
        userlog.save()

        return response
    return wrapped_view

@bp.route('/register', methods=['POST'])
def register():
    """     For new user to register    """
    
    if request.method == 'POST':
        username = request.form['username']
        display_name = request.form['display_name']
        password = request.form['password']
        email = request.form['email']
        error = None
        success_code = 200
        error_code = 400


        if username == '':
            error = 'Username is required.'
        elif password == '':
            error = 'Password is required.'

        elif User.objects(uname=username).first() is not None:
            error = 'User {} is already registered.'.format(username)

        elif User.objects(email=email).first() is not None:
            error = 'Email {} is already registered.'.format(email)

        if error is None:
            new_user = User(uid=uuid.uuid4(), uname=username, \
                            display_name=display_name,
                            password=generate_password_hash(password), \
                            level=2, email=email, register_date=datetime.date(), register_time=datetime.now())
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
            user = User.objects(email=username).first()
            if user is None:
                error = 'Incorrect username.'
            else:
                error = None
        elif not check_password_hash(user.password, password):
            error = 'Incorrect password.'

        if error is None:
            session['user_id'] = user.uid
            user.update(last_login=datetime.now())
            g.user = user
            return jsonify({
                'data' : {
                    'name': user.uname,\
                    'display_name': user.display_name,\
                    'level': user.level,\
                    'avatar': user.avatar
                    # 'token': auth_token
                }, \
                'message': f'User {username} log in success!'
                }), success_code

    return jsonify({
                'data' : None, \
                'message': error
                }), error_code

@bp.route('/curuser', methods=['GET'])
def current_user():
    user_id = session.get('user_id')

    if user_id is None:
        return jsonify({
            'data': None,
            'message': 'Cookie invalidation!'
        }), 401
    else:
        user = User.objects(uid=user_id).only('level').only('display_name').first()
        if user is None:
            return jsonify({
                'data': None,
                'message': 'User not found!'
            }), 404
        else:
            return jsonify({
                'data':  {
                    'display_name': user.display_name,\
                    'level': user.level,
                },
                'message': f'Hello {user.display_name}'
            }), 200




@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = User.objects(uid=user_id).first()
  
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None and request.method != 'GET':
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
