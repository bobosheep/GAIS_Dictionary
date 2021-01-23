import json
import uuid
from mongoengine import Q
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g
)

from backend.db import TermDetail, User, UserLog, NewTerm
from backend.auth import login_required, user_logging

bp = Blueprint('term', __name__, url_prefix='/terms')


def TermDetailtoJSON(term):
    data = json.loads(term.to_json())
    data['created'] = term.created.strftime("%Y-%m-%d (%H:%M)") if term.last_updated is not None else ''
    data['creator'] = term.creator.uname if term.creator is not None else None
    data['editors'] = [ u.uname for u in term.editors ] if term.creator is not None else None
    # data['children'] = [{ 'cname': c.cname, '_id': c.cid} for c in cat.children] if cat.children is not None else []
    data['last_updated'] = term.last_updated.strftime("%Y-%m-%d %H:%M") if term.last_updated is not None else ''
    
    return data
class TermAPI(MethodView):
    stat_code = 200
    message = ''
    data = None
    
    def get(self, tname):
        self.stat_code = 200
        is_error = False
        if tname is not None :
            # return the term if it is in db
            term = TermDetail.objects(tname=tname).first()

            if term is None:
                self.data = None
                self.message = f'Term {tname} not found!'
                self.stat_code = 404
            else:
                term.update(inc__view_cnt=1)
                term = term.reload()
                
                self.data = TermDetailtoJSON(term)
                self.message = f'Get term {tname}\'s seeds!'    


            return jsonify({
                'data'      : self.data,    \
                'message'   : self.message  \
            }), self.stat_code
        else:
            # return all terms w/ params wlen(0=all, 1-8, df:0), size(df:20)
            wlen = request.args.get('wlen', 0, type=int)
            page = request.args.get('page', 0, type=int)
            size = request.args.get('size', 20, type=int)

            self.data = []
            if wlen is 0:
                for n in range(1, 9):
                    b = page * size 
                    e = page * size + size 
                    terms = TermDetail.objects(word_length=n).order_by('-last_updated').only('tname').skip(b).limit(size)
                    # terms = TermDetail.objects(word_length=n).exclude('imgs').exclude('volume').exclude('meaning')
                    count = terms.count()
                    datas = []
                    for term in terms:
                        datas.append(TermDetailtoJSON(term))
                    self.data.append({'wlen': n, 'total': count, 'page': page, 'size': size, 'data': datas})
            else:
                b = page * size 
                e = page * size + size 
                terms = TermDetail.objects(word_length=wlen).only('tname').skip(b).limit(size)
                # terms = TermDetail.objects(word_length=wlen).exclude('imgs').exclude('volume').exclude('meaning').skip(b).limit(size)
                count = terms.count()
                datas = []
                for term in terms:
                    datas.append(TermDetailtoJSON(term))
                self.data.append({'wlen': wlen, 'total': count, 'page': page, 'size': size, 'data': datas})

            return jsonify({
                'datas'      : self.data,    \
                'message'   : self.message  \
            }), self.stat_code

    def post(self, tname):
        # create a new term
        # form body {
        #   'tname'     : String,
        #   'frequency'      : Number,  
        # }
        # Response body {
        #   'data'      : None,
        #   'message'   : String
        # } w/ status code
        self.stat_code = 201
        self.data = None

        term_name = request.form.get('tname', type=str)
        freq = request.form.get('frequency', 0, type=int)
        creator = g.user

        term = TermDetail.objects(tname=term_name).first()

        if term is not None:
            self.message = f'Term {term_name} is already exist!'
            self.stat_code = 400

        else:
            new_term = TermDetail(tname=term_name, word_length=len(term_name), pos=[], chuyin=[], 
                              creator=creator, frequency=freq, aliases=[], related_synonym=[], antonym=[],
                              created=datetime.now(), view_cnt=0, edit_cnt=0, tags=[], imgs=[], meaning='')
            new_term.save()

        return jsonify({
            'data'      : self.data,    \
            'message'   : self.message  \
        }), self.stat_code

    def put(self, tname):
        # update a term
        # request body{
        #   pos: string list,
        #   chuyin: string list,
        #   frequency: number,
        #   aliases: string list,
        #   related_synonym: string list,
        #   synonym: string list
        #   antonym: string list
        #   meaning: string
        # }
        # response the term
        #

        pos = request.form.get('pos', '', type=str).split(',')
        chuyin = request.form.get('chuyin', '', type=str).split(',')
        frequency = request.form.get('frequency', -1, type=int)
        aliases = request.form.get('aliases', '', type=str).split(',')
        related_synonym = request.form.get('related_synonym', '', type=str).split(',')
        synonym = request.form.get('synonym', '', type=str).split(',')
        antonym = request.form.get('antonym', '', type=str).split(',')
        meaning = request.form.get('meaning', '', type=str)


        term = TermDetail.objects(tname=tname).first()

        if term is None:
            self.data = None
            self.message = f'Term {tname} is not found!'
            self.stat_code = 404

        else:
            editor = g.user
            if pos != '':
                term.update_one(pos=pos)
            if chuyin != '':
                term.update_one(chuyin=chuyin)
            if frequency != '':
                term.update_one(frequency=frequency)
            if aliases != '':
                term.update_one(aliases=aliases)
            if related_synonym != '':
                term.update_one(related_synonym=related_synonym)
            if synonym != '':
                term.update_one(synonym=synonym)
            if antonym != '':
                term.update_one(antonym=antonym)
            if meaning != '':
                term.update_one(meaning=meaning)
            term.update_one(inc__edit_cnt=1)
            term.update_one(set__last_updated=datetime.now())
            term.update_one(add_to_set__editors=[editor], full_result=True)
            term = term.reload()

            self.data = TermDetailtoJSON(term)
            self.message = f'Update {tname} detail successfully!'
            self.stat_code = 200


        return jsonify({
            'data'      : self.data,    \
            'message'   : self.message  \
        }), self.stat_code
    
    def delete(self, tname):
        # delete a term
        self.stat_code = 200
        self.data = None
        
        term = TermDetail.objects(tname=tname).first()

        if term is None:
            self.message = 'Params error!'
            self.stat_code = 400

        else:
            term.delete()

        return jsonify({
            'data'      : self.data,    \
            'message'   : self.message  \
        }), self.stat_code

        
term_view = user_logging(login_required(TermAPI.as_view('term_api')))
bp.add_url_rule('/', defaults={'tname': None}, view_func=term_view, methods=['GET', 'POST'])
bp.add_url_rule('/<string:tname>', view_func=term_view, methods=['GET', 'PUT', 'DELETE'])

@bp.route('/stat', methods=['GET'])
@user_logging
def stat():
    total_term = TermDetail.objects().count()
    total_uncheck = NewTerm.objects().count()
    last_updated = UserLog.objects(action_stat=True, level=1).only('action_time').first()
    last_updated = last_updated.action_time.strftime("%Y-%m-%d")

    data = {
        'total_term': total_term,
        'total_uncheck': total_uncheck,
        'last_updated': last_updated
    }

    return jsonify({
        'data': data,
        'message': 'Get terms stat'
    }), 200