import json
import uuid
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from flaskr.db import CategoryNode, CategoryLeaf, User, UserLog
from flaskr.auth import login_required, user_logging, admin_only

bp = Blueprint('admin', __name__, url_prefix='/admin')

def getUserStatistic():
    total_users = User.objects.count()
    activated_users = User.objects(activated=True).count()
    editor_users = User.objects(level=1).count()
    admins = User.objects(level=0).count()
    week_edit = UserLog.this_week_actions().filter(__raw__={'action_part._ref.$collection':'category'}).count()
    month_edit = UserLog.this_week_actions().filter(__raw__={'action_part._ref.$collection':'category'}).count()

    data = {
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
            'users': getUserStatistic(),
            'cats' : None,
            'terms' : None,
            'others' : None
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
            self.data = user.to_json()
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
                'users' : [user.to_json() for user in users],
                'actions' : [action.to_json() for action in actions]
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