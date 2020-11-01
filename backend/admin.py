import json
import uuid
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from backend.db import CategoryNode, CategoryLeaf, User, UserLog
from backend.auth import login_required, user_logging, admin_only

bp = Blueprint('admin', __name__, url_prefix='/admin')

def userToJSON(user):
    data = json.loads(user.to_json())
    data['register_date'] = user.register_date.strftime("%Y-%m-%d")
    data['register_time'] = user.register_date.strftime("%Y-%m-%d %H:%M")
    data['last_login'] = user.last_login.strftime("%Y-%m-%d %H:%M") if user.last_login is not None else None

    return data

def getUserStatistic():
    total_users = User.objects.count()
    activated_users = User.objects(activated=True).count()
    new_users = User.this_month_register().count()
    editor_users = User.objects(level=1).count()
    admins = User.objects(level=0).count()
    week_edit = UserLog.this_week_actions().filter(__raw__={'action_part._ref.$collection':'category'}).count()
    month_edit = UserLog.this_week_actions().filter(__raw__={'action_part._ref.$collection':'category'}).count()
    # week_edit = UserLog.this_week_actions().count()
    # month_edit = UserLog.this_week_actions().count()

    data = {
        'new_users' : new_users,
        'total_users' : total_users,
        'activated_users' : activated_users,
        'editor_users' : editor_users,
        'admins' : admins,
        'week_edit' : week_edit,
        'month_edit' : month_edit
    }
    return data


class AdminAPI(MethodView):
    stat_code = 200
    message = ''
    data = None
    
    def get(self):
        self.stat_code = 200
        self.data = {
            'user': getUserStatistic(),
            'category' : None,
            'term' : None,
            'other' : None
        }
        return jsonify({
            'data': self.data,  \
            'message': self.message
        }), self.stat_code

class AdminUsersAPI(MethodView) :
    stat_code = 200
    message = ''
    data = None
    
    def get(self, uid):
        if uid is not None:
            self.stat_code = 200
            user = User.objects(uid=uid).exclude('password').first()
            self.data = userToJSON(user)
            self.message = 'Get user dashboard successfully!'
            return jsonify({
                'data': self.data,  \
                'message': self.message
            }), self.stat_code


        else:
            self.stat_code = 200
            users = User.objects.exclude('password').exclude('prefer')
            actions = UserLog.objects[:20]
            self.data = {
                'stat' : getUserStatistic(),
                'users' : [userToJSON(user) for user in users],
                'actions' : [json.loads(action.to_json()) for action in actions]
            }
            self.message = 'Get users dashboard successfully!'
            return jsonify({
                'data': self.data,  \
                'message': self.message
            }), self.stat_code

admin_view = admin_only(AdminAPI.as_view('admin_api'))
admin_users_view = admin_only(AdminUsersAPI.as_view('admin_users_api'))

bp.add_url_rule('/', view_func=admin_view, methods=['GET'])
bp.add_url_rule('/users', defaults={'uid': None}, view_func=admin_users_view, methods=['GET'])
bp.add_url_rule('/users/<string:uid>', view_func=admin_users_view, methods=['GET'])