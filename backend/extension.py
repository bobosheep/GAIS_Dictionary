import json
import uuid
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from backend.db import CategoryNode, User
from backend.auth import login_required, user_logging
from backend.tools import extension as ext

bp = Blueprint('extension', __name__, url_prefix='/extension')

def catTermsExtend(terms, iteration, model, threshold, n_results, coverage):
    results = set()
    extesions = set()
    for i in range(iteration):
        if i == 0:
            extensions = ext.extend(terms, model=model, threshold=threshold, n_results=n_results)
            results = extensions
        else:
            tmp = []
            tmp = list(set(extensions))
            extesions = []
            for e in tmp:
                simWords = ext.extend([e], model=model, threshold=threshold, n_results=n_results)
                cov = ext.checkCoverage(results, simWords)
                if cov >= coverage:
                    extesions += simWords
                    results += simWords 
        print('len of results: ', len(results))
    return results


class ExtensionAPI(MethodView):
    data = None
    status_code = 400
    message = ''

    def post(self, cid):
        if cid is not None:
            cat = CategoryNode.objects(cid=cid).all_fields().first()

            if cat is None:
                self.data = None
                self.status_code = 404
                self.message = 'Category not found'
            
            else:
                method      = int(request.form['method'])       if 'method' in request.form     else 1
                iteration   = int(request.form['iteration'])    if 'iteration' in request.form  else 2
                model       = str(request.form['model'])        if 'model' in request.form      else 'wiki_news' 
                threshold   = float(request.form['threshold'])  if 'threshold' in request.form  else 0.5
                n_results   = int(request.form['n_results'])    if 'n_results' in request.form  else 10
                coverage    = float(request.form['coverage'])   if 'coverage' in request.form   else 0.3
                f_remove    = (False if request.form['f_remove'] == 'false' or request.form['f_remove'] == 'False' else True) if 'f_remove' in request.form else True
                f_exist     = (False if request.form['f_exist'] == 'false' or request.form['f_exist'] == 'False' else True) if 'f_exist' in request.form else True

                seeds = cat.seeds

                if method > 1 or method < 1 or\
                   iteration > 5 or iteration < 1 or\
                   model not in ext.models or \
                   threshold >= 1.0  or threshold < 0.1 or\
                   n_results > 100 or n_results < 5 or\
                   coverage >= 0.8 or coverage < 0.1 :
                    self.data = None
                    self.status_code = 400
                    self.message = 'Params error'

                res = catTermsExtend(seeds, iteration, model, threshold, n_results, coverage)
                res = list(set(res))
                remove_words = cat.remove_terms
                terms = cat.terms
                if f_remove:
                        res = list(filter(lambda x: x not in remove_words, res))
                if f_exist:
                        res = list(filter(lambda  x: x not in terms, res))
                
                self.data = res
                self.status_code = 200
                self.message = f'Extend {cat.cname} seeds successfully with {len(res)} results!'

        else:
            method      = int(request.form['method'])       if 'method' in request.form     else 1
            iteration   = int(request.form['iteration'])    if 'iteration' in request.form  else 2
            model       = str(request.form['model'])        if 'model' in request.form      else 'wiki_news' 
            threshold   = float(request.form['threshold'])  if 'threshold' in request.form  else 0.5
            n_results   = int(request.form['n_results'])    if 'n_results' in request.form  else 10
            coverage    = float(request.form['coverage'])   if 'coverage' in request.form   else 0.3

            if method > 1 or method < 1 or\
                iteration > 5 or iteration < 1 or\
                model not in ext.models or \
                threshold >= 1.0  or threshold < 0.1 or\
                n_results > 100 or n_results < 5 or\
                coverage >= 0.8 or coverage < 0.1 :
                self.data = None
                self.status_code = 400
                self.message = 'Params error'
            
            else:
                cats = CategoryNode.objects()

                res = []
                for cat in cats:
                    seeds = cat.seeds
                    data = catTermsExtend(seeds, iteration, model, threshold, n_results, coverage)
                    res.append({
                        'cid': cat._id,
                        'cname': cat.cname,
                        'candidates': data,
                        'candidates_cnt': len(data) 
                    })
                self.data = res
                self.status_code = 200
                self.message = f'Extend all category\'s seeds successfully!'

        return jsonify({
            'datas': self.data,
            'message': self.message,
        }), self.status_code


extension_view = user_logging(login_required(ExtensionAPI.as_view('extension_api')))

bp.add_url_rule('/', defaults={"cid": None}, view_func=extension_view, methods=['POST'])
bp.add_url_rule('/<string:cid>', view_func=extension_view, methods=['POST'])



@bp.route('/term', methods=['GET'])
@user_logging
@login_required
def getTermSim():

    data = None
    message = ''
    status_code = 200

    term        = request.args['term']              if 'term' in request.args       else None
    n_results   = int(request.args['n_results'])    if 'n_results' in request.args  else 10
    cid         = str(request.args['cid'])          if 'cid' in request.args        else ''
    model       = str(request.args['model'])        if 'model' in request.args      else 'wiki_news'
    with_sim    = (True if request.args['with_sim'] == 'true' or request.args['with_sim'] == 'True' else False) if 'with_sim' in request.args else False
    f_remove    = (True if request.args['f_remove'] == 'true' or request.args['f_remove'] == 'True' else False) if 'f_remove' in request.args else False
    f_exist     = (True if request.args['f_exist'] == 'true' or request.args['f_exist'] == 'True' else False) if 'f_exist' in request.args else False

    if term is None or \
       n_results > 100 or n_results < 1 or\
       model not in ext.models:
        data = None
        message = 'Extend term parameter error!'
        status_code = 400
    
    else:
        extension = ext.similarWord(term, n_results=n_results, model=model, with_similarity=with_sim)
        if cid != '':
            cat = CategoryNode.objects(cid=cid).first()
            if cat is None:
                data = None
                message = 'Category not found!'
                status_code = 404

            remove_words = cat.remove_terms
            terms = cat.terms
            if f_remove:
                if with_sim:
                    extension = list(filter(lambda x: x[0] not in remove_words, extension))
                else:
                    extension = list(filter(lambda x: x not in remove_words, extension))
            if f_exist:
                if with_sim:
                    extension = list(filter(lambda  x: x[0] not in terms, extension))
                else:
                    extension = list(filter(lambda  x: x not in terms, extension))

        data = extension
        message = f'Extend term {term} successfully with {len(extension)} results!'
        status_code = 200

    return jsonify({
        'datas': data,
        'message': message
    }), status_code