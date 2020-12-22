import json
import uuid
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from backend.db import CategoryNode, User
from backend.auth import login_required, user_logging

bp = Blueprint('cat', __name__, url_prefix='/classes')

def getChildrenRecursive(cat):
    if cat is None:
        return 
    cat = CategoryNode.objects(cid=cat.cid).only('cid').only('cname').only('children').first()
    data = json.loads(cat.to_json())
    data['children'] = []
    for c in cat.children:
        d = getChildrenRecursive(c)
        data['children'].append(d)
    return data

def getParentRecursive(cat):
    if cat is None:
        return []
    if cat.parent is not None:
        data = getParentRecursive(cat.parent)
        data += [cat.parent.cname]
        return data
    return []

def CategoryNodetoJSON(cat):
    data = json.loads(cat.to_json())
    data['created'] = cat.created.strftime("%Y-%m-%d (%H:%M)")
    data['creator'] = cat.creator.uname if cat.creator is not None else None
    data['editors'] = [ u.uname for u in cat.editors ]
    data['parent'] = cat.parent.cname if cat.parent is not None else None
    children = []
    if cat.children is not None:
        for c in cat.children:
            child = {
                '_id': c.cid,
                'cname': c.cname,
                'terms': c.terms if 'terms' in c else None,
                'children': [{ 'cname': cc.cname, '_id': cc.cid} for cc in c.children] if 'children' in c else None
            }
            children.append(child)
    data['children'] = children
    # data['children'] = [{ 'cname': c.cname, '_id': c.cid} for c in cat.children] if cat.children is not None else []
    data['last_updated'] = cat.last_updated.strftime("%Y-%m-%d %H:%M") if cat.last_updated is not None else ''
    data['ancestors'] = getParentRecursive(cat)
    
    return data

class CategoryAPI(MethodView):
    stat_code = 200
    message = ''
    data = None
    
    def get(self, cid):
        self.stat_code = 200
        is_error = False
        if cid is not None :
            # return category info
            cat = CategoryNode.objects(cid=cid).first()

            if cat is None:
                # Category not found

                self.data = None
                self.message = f'Category {cid} not found!'
                self.stat_code = 404
                is_error = True

            else:
                cat.update(inc__view_cnt=1)
                cat = cat.reload()

                data = CategoryNodetoJSON(cat)
                self.data = data
                self.message = f'Get category {cat.cname} successfully!'

            return jsonify({
                'data': self.data,  \
                'message': self.message
            }), self.stat_code


        else:
            # return all category info
            cat = CategoryNode.objects()
            data = []
            for c in cat:
                cat_dict = CategoryNodetoJSON(c)
                data.append(cat_dict)
            self.data = data
            self.message = f'Get all categories successfully!'

            return jsonify({
                'datas': self.data,  \
                'message': self.message
            }), self.stat_code

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
        self.stat_code = 201

        cname = request.form['cname']
        is_root = True if request.form['is_root'] == 'True' or request.form['is_root'] == 'true' else False
        parent = request.form['parent_name'] if not is_root else ''
        seeds = list(set(request.form['seeds'].split(','))) if not is_root else None
        terms = list(set(request.form['terms'].split(','))) if not is_root else None
        mutex = True if request.form['mutex'] == 'True' or request.form['mutex'] == 'true' else False

        if type(cname) is not str or type(is_root) is not bool:
            self.message = 'Request type error!'
            self.data = None
            self.stat_code = 400

        elif (not is_root and parent is None) or (is_root and mutex is None):
            self.message = 'Request params error!'
            self.data = None
            self.stat_code = 400

        else:
            # Check cname
            cat_cnt = CategoryNode.objects(cname=cname).count()
            if cat_cnt > 0 :
                self.message = f'Category {cname} exists!'
                self.data = None
                self.stat_code = 400
            else:
                try:
                    if is_root:
                        new_cat = CategoryNode( cid=uuid.uuid4(), cname=cname,              \
                                                is_root=is_root, child_mutex=mutex,         \
                                                root_cat=cname, view_cnt=0, edit_cnt=0,     \
                                                creator=g.user, editors=[g.user],           \
                                                created=datetime.now(), published=True
                                            )
                        new_cat.save()
                        self.message = f'Category {cname} is created successfully!'
                        self.data = {
                            '_id': new_cat.cid,
                            'cname' : new_cat.cname
                        }
                    else:
                        seeds = [] if seeds is None else ([seeds] if type(seeds) is str else seeds)
                        terms = [] if terms is None else ([terms] if type(terms) is str else terms)

                        parent_cat = CategoryNode.objects(cname=parent).first()
                        if parent_cat is None:
                            self.message = f'Parent category {parent} not found!'
                            self.data = None
                            self.stat_code = 404

                        else:
                            new_cat = CategoryNode( cid=uuid.uuid4(), cname=cname,              \
                                                    is_root=is_root, child_mutex=mutex,         \
                                                    root_cat=parent_cat.root_cat, view_cnt=0, edit_cnt=0,     \
                                                    creator=g.user, editors=[g.user],           \
                                                    created=datetime.now(), parent=parent_cat,  \
                                                    published=True
                                                )
                                                
                            new_cat.save()
                            parent_cat.update(add_to_set__children=[new_cat])
                            self.message = f'Category {cname} is created successfully!'
                            self.data = {
                                '_id': new_cat.cid,
                                'cname' : new_cat.cname,
                                'parent': new_cat.parent.cname
                            }
                except:
                    self.data = None
                    self.message = f'Category {cname} insert error!'
                    self.stat_code = 500

        ### TODO: Add user log
        return jsonify({
            'data'      : self.data,    \
            'message'   : self.message  \
        }), self.stat_code







    def delete(self, cid):
        # delete a single category
        ### Add user log
        return jsonify({
            'data'      : None,    \
            'message'   : 'Not implement'  \
        }), 501

    def put(self, cid):
        # update a single category
        self.stat_code = 201
        editor = g.user
        cat = CategoryNode.objects(cid=cid).first()

        if cat is None:
            self.data = None
            self.message = f'Category not found'
            self.stat_code = 404

        else:
            
            cname = request.form['cname']
            parent = request.form['parent_name'] 
            mutex = request.form['mutex']

            if len(cname) > 0:
                # Edit name
                try:
                    cat.cname = cname
                    cat.update(cname=cname)
                except:
                    self.data = None
                    self.message = f'Category {cat.cname} update name error!'
                    self.stat_code = 500


            if len(parent) > 0:
                parent_cat = CategoryNode.objects(cname=parent)
                
                if parent_cat.first() is None:
                    self.data = None
                    self.message = f'Parent category {parent} not found!'
                    self.stat_code = 404
                else:
                    # try:
                    if cat.parent is not None:
                        cat.parent.update(pull__children=cat)
                    parent_cat.update(add_to_set__children=[cat])
                    cat.update(parent=parent_cat, root_cat=parent_cat.root_cat)
                    cat.parent = parent_cat
                    cat.root_cat = parent_cat.root_cat
                    # except:
                    #     self.data = None
                    #     self.message = f'Category {cat.cname} or {parent_cat.cname} update error!'
                    #     self.stat_code = 500

            if len(mutex) > 0:
                mutex = True if mutex == 'True' or mutex == 'true' else False
                try:
                    cat.child_mutex = mutex
                    cat.update(child_mutex=mutex)
                except:
                    self.data = None
                    self.message = f'Category {cat.cname} update mutex error!'
                    self.stat_code = 500

            if self.stat_code == 201:
                cat.edit_cnt += 1
                cat.last_updated = datetime.now()
                cat.update(add_to_set__editors=[editor])
                cat = cat.first()

                data = CategoryNodetoJSON(cat)


                self.data = data
                self.message = f'Update category {cat.cname} successfully!'
        


        ### TODO: Add user log

        return jsonify({
            'data': self.data,
            'message': self.message
        }), self.stat_code




class CategorySeedsAPI(MethodView):
    stat_code = 200
    message = ''
    data = None
   
    def get(self, cid):
        self.stat_code = 200
        if cid is not None :
            # return the info of that category's seeds
            cat = CategoryNode.objects(cid=cid).only('cid').only('cname').only('seeds').first()
            if cat is None:
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                self.data = {
                    'cname': cat.cname,
                    '_id': cat.cid,
                    'seeds': cat.seeds
                }
                self.message = f'Get category {cat.cname}\'s seeds!'    

            return jsonify({
                'data': self.data,
                'message': self.message
            }), self.stat_
            
        else:
            # return the info of all categories' seeds
            root_cat = request.args['rcat']
            cats = CategoryNode.objects().only('cid').only('cname').only('seeds')
            if len(root_cat) > 0:
                cats = CategoryNode.objects(root_cat=root_cat).only('cid').only('cname').only('seeds')
            if cats is None:
                self.data = None
                self.message = 'Category empty!'
                self.stat_code = 404
            else:
                datas = []
                for cat in cats:
                    data = {
                        'cname': cat.cname,
                        '_id': cat.cid,
                        'seeds': cat.seeds
                    }
                    datas.append(data)
                self.data = datas
                self.message = f'Get all category seeds!'
            
            return jsonify({
                'datas': self.data,
                'message': self.message
            }), self.stat_code


    def post(self, cid):
        # create a/many new seeds
        editor = g.user
        self.stat_code = 201
        seeds = request.form['seeds']

        if len(seeds) < 1:
            self.data = None
            self.message = 'Parameter seeds can not be empty!'
            self.stat_code = 400
        
        else:
            cat = CategoryNode.objects(cid=cid).only('seeds').only('cname').only('cid').only('edit_cnt')
            if cat.first() is None:
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                seeds = seeds.split(',')
                cat.update_one(add_to_set__seeds=seeds)
                cat.update_one(pull_all__remove_terms=seeds)
                cat.update_one(inc__edit_cnt=1)
                cat.update_one(set__last_updated=datetime.now())
                cat.update_one(add_to_set__editors=[editor])
                cat = cat.first()
                self.data = {
                    '_id' : cat.cid,
                    'cname' : cat.cname,
                    'seeds' : cat.seeds
                }
                self.message = f'Add {cat.cname}\'s seeds successfully!'

        return jsonify({
            'data': self.data,   \
            'message' : self.message
        }), self.stat_code

    def delete(self, cid):
        # delete a single seed
        editor = g.user
        self.stat_code = 200
        seeds = request.args['seeds']
        

        if len(seeds) < 1:
            self.data = None
            self.message = 'Parameter seeds can not be empty!'
            self.stat_code = 400
        
        else:
            cat = CategoryNode.objects(cid=cid).only('seeds').only('cname').only('cid').only('edit_cnt')
            if cat.first() is None:
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                seeds = seeds.split(',')
                cat.update_one(pull_all__seeds=seeds)
                cat.update_one(add_to_set__remove_terms=seeds)
                cat.update_one(inc__edit_cnt=1)
                cat.update_one(set__last_updated=datetime.now())
                cat.update_one(add_to_set__editors=[editor])
                cat = cat.first()
                self.data = {
                    '_id' : cat.cid,
                    'cname' : cat.cname,
                    'seeds' : cat.seeds
                }
                self.message = f'Remove part of {cat.cname}\'s seeds successfully!'
                # except:
                #     self.data = None
                #     self.message = f'Remove part of {cat.cname}\'s seeds error!'
                #     self.stat_code = 500


        return jsonify({
            'data': self.data,   \
            'message' : self.message
        }), self.stat_code




class CategoryTermsAPI(MethodView):
    stat_code = 200
    message = ''
    data = None
    
    def get(self, cid):
        self.code = 200
        if cid is not None :
            # return the info of that category's terms
            cat = CategoryNode.objects(cid=cid).only('cid').only('cname').only('terms').only('edit_cnt').first()
            if cat is None:
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                self.data = {
                    'cname': cat.cname,
                    '_id': cat.cid,
                    'terms': cat.terms
                }
                self.message = f'Get category {cat.cname}\'s terms!'
        else:
            # return the info of all categories' terms
            root_cat = request.args['rcat']
            cats = CategoryNode.objects().only('cid').only('cname').only('terms')
            if cats is None:
                self.data = None
                self.message = 'Category empty!'
                self.stat_code = 404
            else:
                datas = []
                for cat in cats:
                    data = {
                        'cname': cat.cname,
                        'cid': cat.cid,
                        'terms': cat.terms
                    }
                    datas.append(data)
                self.data = datas
                self.message = f'Get all category terms!'
        
        return jsonify({
            'data': self.data,
            'message': self.message
        }), self.stat_code


    def post(self, cid):
        # create a/many new terms
        editor = g.user
        self.stat_code = 201
        terms = request.form['terms']

        if len(terms) < 1:
            self.data = None
            self.message = 'Parameter terms can not be empty!'
            self.stat_code = 400
        
        else:
            cat = CategoryNode.objects(cid=cid).only('terms').only('cname').only('cid').only('edit_cnt')
            if cat.first() is None:
                is_error = True
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                terms = terms.split(',')
                cat.update_one(add_to_set__terms=terms)
                cat.update_one(pull_all__remove_terms=terms)
                cat.update_one(inc__edit_cnt=1)
                cat.update_one(set__last_updated=datetime.now())
                cat.update_one(add_to_set__editors=[editor], full_result=True)
                cat = cat.first()
                self.data = {
                    'cid' : cat.cid,
                    'cname' : cat.cname,
                    'terms' : cat.terms
                }
                self.message = f'Add {cat.cname}\'s terms successfully!'

        return jsonify({
            'data': self.data,   \
            'message' : self.message
        }), self.stat_code

    def delete(self, cid):
        # delete a single term
        editor = g.user
        self.stat_code = 200
        terms = request.args['terms']
        

        if len(terms) < 1:
            self.data = None
            self.message = 'Parameter terms can not be empty!'
            self.stat_code = 400
        
        else:
            cat = CategoryNode.objects(cid=cid).only('terms').only('cname').only('cid')
            if cat.first() is None:
                self.data = None
                self.message = 'Category not found!'
                self.stat_code = 404
            else:
                try:
                    terms = terms.split(',')
                    cat.update(pull_all__terms=terms)
                    cat.update(add_to_set__remove_terms=terms)
                    cat.update(inc__edit_cnt=1)
                    cat.update(set__last_updated=datetime.now())
                    cat.update(add_to_set__editors=[editor])
                    cat = cat.first()
                    self.data = {
                        'cid' : cat.cid,
                        'cname' : cat.cname,
                        'terms' : cat.terms
                    }
                    self.message = f'Remove part of {cat.cname}\'s seeds successfully!'
                except:
                    self.data = None
                    self.message = f'Remove part of {cat.cname}\'s seeds error!'
                    self.stat_code = 500


        return jsonify({
            'data': self.data,   \
            'message' : self.message
        }), self.stat_code




category_view = user_logging(login_required(CategoryAPI.as_view('category_api')))
category_seeds_view = user_logging(login_required(CategorySeedsAPI.as_view('category_seeds_api')))
category_terms_view = user_logging(login_required(CategoryTermsAPI.as_view('category_terms_api')))

bp.add_url_rule('/', defaults={"cid": None}, view_func=category_view, methods=['GET', 'POST'])
bp.add_url_rule('/<string:cid>', view_func=category_view, methods=['GET', 'PUT', 'DELETE'])
bp.add_url_rule('/seeds', defaults={"cid": None}, view_func=category_seeds_view, methods=['GET'])
bp.add_url_rule('/<string:cid>/seeds', view_func=category_seeds_view, methods=['GET', 'POST', 'DELETE'])
bp.add_url_rule('/terms', defaults={"cid": None}, view_func=category_terms_view, methods=['GET'])
bp.add_url_rule('/<string:cid>/terms', view_func=category_terms_view, methods=['GET', 'POST', 'DELETE'])



@bp.route('/list', methods=['GET'])
def getCategoryList():
    cats = CategoryNode.objects(is_root=True).only('cid').only('cname').only('children')

    datas = []
    ### TODO: change to recursive
    for cat in cats:
        # child_cats = CategoryNode.objects(parent__exists=True, parent=cat).only('cid').only('cname')
        # data = json.loads(cat.to_json())
        # data['children'] = []
        # for c in child_cats:
        #     data['children'].append(json.loads(c.to_json()))
        data = getChildrenRecursive(cat)
        datas.append(data)
        
    
    return jsonify({
            'datas': datas,   \
            'message' : 'Get category list successfully!'
        }), 200
        


@bp.route('/stat', methods=['GET'])
@user_logging
def getCategoryStat():
    cats = CategoryNode.objects(is_root=True).all_fields()

    datas = []
    ### TODO: change to recursive
    for cat in cats:
        child_cats = CategoryNode.objects(parent__exists=True, parent=cat).exclude('seeds').exclude('terms').exclude('remove_terms')
        
        data = CategoryNodetoJSON(cat)
        data['children'] = []
        for c in child_cats:
            cat_dict = CategoryNodetoJSON(c)
            data['children'].append(cat_dict)
        datas.append(data)
        
    
    return jsonify({
            'datas': datas,   \
            'message' : 'Get category stat successfully!'
        }), 200

