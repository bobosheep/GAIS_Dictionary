import json
import uuid
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from flaskr.db import CategoryNode, CategoryLeaf, User
from flaskr.auth import login_required

bp = Blueprint('cat', __name__, url_prefix='/classes')


class CategoryAPI(MethodView):
    success_code = 200
    error_code = 400
    message = ''
    data = None
    
    def get(self, cid):
        is_error = False
        if cid is not None :
            # return category info
            cat = CategoryNode.objects(cid=cid).first()

            if cat is None:
                # Category not found

                self.data = None
                self.message = f'Category {cid} not found!'
                self.error = 404
                is_error = True

            else:
                cat.view_cnt += 1
                cat.save()

                data = json.loads(cat.to_json())
                data['created'] = cat.created.strftime("%Y-%m-%d %H:%M")
                data['editors'] = [ u.uname for u in cat.editors ]
                data['parent'] = cat.parent.cname if cat.parent is not None else None
                if cat.last_updated is not None:
                    data['last_updated'] = cat.last_updated.strftime("%Y-%m-%d %H:%M")


                self.data = data
                self.message = f'Get category {cat.cname} successfully!'

                ### TODO: Add user log

        else:
            # return all category info
            cat = CategoryNode.objects()
            data = []
            for c in cat:
                cat_dict = json.loads(c.to_json())
                cat_dict['created'] = c.created.strftime("%Y-%m-%d (%H:%M)")
                cat_dict['editors'] = [ u.uname for u in c.editors ]
                cat_dict['parent'] = c.parent.cname if c.parent is not None else None
                if c.last_updated is not None:
                    cat_dict['last_updated'] = c.last_updated.strftime("%Y-%m-%d %H:%M")
                data.append(data)
            self.data = data
            self.message = f'Get all categories successfully!'
            pass

        if is_error:
            return jsonify({
                'data': self.data,  \
                'message': self.message
            }), self.error_code
        else:
            return jsonify({
                'data': self.data,  \
                'message': self.message
            }), self.success_code


    def post(self, cid):
        # create a new category
        # Request body {
        #   'cname'     : String,
        #   'is_root'   : Boolean,
        #   'parent'    : String,   # if is_root is False, required
        #   'seeds'     : String or String List,
        #   'terms'     : String or String List,
        #   'mutex'     : Boolean
        # }
        # Response body {
        #   'data'      : None,
        #   'message'   : String
        # } w/ status code
        is_error = False

        cname = str(request.form['cname'])
        is_root = bool(request.form['is_root'])
        parent = str(request.form['parent_name']) if not is_root else None
        seeds = request.form['seeds'] if not is_root else None
        terms = request.form['terms'] if not is_root else None
        mutex = bool(request.form['mutex']) if is_root else None

        if type(cname) is not str or type(is_root) is not bool:
            is_error = True
            self.message = 'Request type error!'
            self.data = None

        elif (not is_root and parent is None) or (is_root and mutex is None):
            is_error = True
            self.message = 'Request params error!'
            self.data = None

        else:
            # Check cname
            cat_cnt = CategoryNode.objects(cname=cname).count()
            if cat_cnt > 0 :
                is_error = True
                self.message = f'Category {cname} exists!'
                self.data = None
            else:
                if is_root:
                    new_cat = CategoryNode( cid=uuid.uuid4(), cname=cname,              \
                                            is_root=is_root, child_mutex=mutex,         \
                                            root_cat=cname, view_cnt=0, edit_cnt=0,     \
                                            creator=g.user, editors=[g.user],           \
                                            created=datetime.now(), published=True
                                           )
                    new_cat.save()
                    self.message = f'Category {cname} is created successfully!'
                    self.data = None
                else:
                    seeds = [] if seeds is None else ([seeds] if type(seeds) is str else seeds)
                    terms = [] if terms is None else ([terms] if type(terms) is str else terms)
                    parent_cat = CategoryNode.objects(cname=parent).first()
                    if parent_cat is None:
                        is_error = True
                        self.message = f'Parent category {cname} not found!'
                        self.data = None
                    else:
                        new_cat = CategoryLeaf( cid=uuid.uuid4(), cname=cname,              \
                                                is_root=is_root, child_mutex=mutex,         \
                                                root_cat=parent_cat.root_cat, view_cnt=0, edit_cnt=0,     \
                                                creator=g.user, editors=[g.user],           \
                                                created=datetime.now(), parent=parent_cat,  \
                                                published=True
                                            )
                                            
                        new_cat.save()
                        self.message = f'Category {cname} is created successfully!'
                        self.data = None


        if is_error:
            return jsonify({
                'data'      : self.data,    \
                'message'   : self.message  \
            }), self.error_code
        else:                
            ### TODO: Add user log
            return jsonify({
                'data'      : self.data,    \
                'message'   : self.message  \
            }), self.success_code







    def delete(self, cid):
        # delete a single category
                ### Add user log
        pass

    def put(self, cid):
        # update a single category
        ### Add user log
        pass



class CategorySeedsAPI(MethodView):
    success_code = 200
    error_code = 400
    message = ''
    data = None
   
    def get(self, cid):
        if cid is not None :
            # return the info of that category's seeds 
            pass
        else:
            # return the info of all categories' seeds
            pass
    def post(self, cid):
        # create a/many new seeds

        return jsonify({
                'data': self.data,   \
                'message' : 'Success to add seed(s)'
            }), 200
        pass

    def delete(self, cid):
        # delete a single seed
        pass

    def put(self, cid):
        # update a single seed
        pass


class CategoryTermsAPI(MethodView):
    success_code = 200
    error_code = 400
    message = ''
    data = None
    
    def get(self, cid):
        if cid is not None :
            # return the info of that category's terms 
            pass
        else:
            # return the info of all categories' terms
            pass


    def post(self, cid):
        # create a/many new terms
        pass

    def delete(self, cid):
        # delete a single term
        pass

    def put(self, cid):
        # update a single term
        pass



category_view = login_required(CategoryAPI.as_view('category_api'))
category_seeds_view = login_required(CategorySeedsAPI.as_view('category_seeds_api'))
category_terms_view = login_required(CategoryTermsAPI.as_view('category_terms_api'))

bp.add_url_rule('/', defaults={"cid": None}, view_func=category_view, methods=['GET', 'POST'])
bp.add_url_rule('/<string:cid>', view_func=category_view, methods=['GET', 'PUT', 'DELETE'])
bp.add_url_rule('/seeds', defaults={"cid": None}, view_func=category_seeds_view, methods=['GET'])
bp.add_url_rule('/<string:cid>/seeds', view_func=category_seeds_view, methods=['GET', 'POST', 'PUT', 'DELETE'])
bp.add_url_rule('/terms', defaults={"cid": None}, view_func=category_terms_view, methods=['GET'])
bp.add_url_rule('/<string:cid>/terms', view_func=category_terms_view, methods=['GET', 'POST', 'PUT', 'DELETE'])




@bp.route('/list', methods=['GET'])
def getCategoryList():
    cats = CategoryNode.objects(is_root=True).only('cid').only('cname')

    datas = []
    ### TODO: change to recursive
    for cat in cats:
        child_cats = CategoryNode.objects(parent__exists=True, parent=cat).only('cid').only('cname')
        data = json.loads(cat.to_json())
        data['children'] = []
        for c in child_cats:
            data['children'].append(json.loads(c.to_json()))
        datas.append(data)
        
    
    return jsonify({
            'data': datas,   \
            'message' : 'Get category list successfully!'
        }), 200
        