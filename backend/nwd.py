import json
import uuid
import os
from datetime import datetime
from flask.views import MethodView
from flask import (
    jsonify, Blueprint, request, g, current_app
)
from werkzeug.utils import secure_filename

from backend.db import TermDetail, User, NewTerm
from backend.auth import login_required, user_logging

bp = Blueprint('nwd', __name__, url_prefix='/api/nwd')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def get_file_term(filename):
    terms = []
    stat = True
    with open(filename, 'r', encoding='utf-8') as fp:
        for line in fp.readlines():
            line = line.strip('\n')
            term = line.split('\t')[0]
            frequency = int(line.split('\t')[-1])
            if len(term) > 10:
                stat = False
            terms.append((term, frequency))
    return stat, terms

def insert_new_word(terms):
    creator = g.user
    count = 0
    for term, fq in terms:
        check_term1 = TermDetail.objects(tname=term).first()
        check_term2 = NewTerm.objects(tname=term).first()
        if check_term1 is not None or check_term2:
            continue
        new_term = NewTerm(tname=term, word_length=len(term),
                        creator=creator, frequency=fq,
                        created=datetime.now(), checked=False)
        new_term.save()
        count += 1
    return count
        
def new_term_toJSON(term):
    data = json.loads(term.to_json())
    data['created'] = term.created.strftime("%Y-%m-%d (%H:%M)")
    data['creator'] = term.creator.uname if term.creator is not None else 'Guest'
    data['accepts'] = [u.uname for u in term.accepts] if term.accepts is not None else None
    data['rejects'] = [u.uname for u in term.rejects] if term.rejects is not None else None
    data['check_time'] = term.check_time.strftime("%Y-%m-%d (%H:%M)") if term.check_time is not None else None
    
    return data



@bp.route('/upload', methods=['POST'])
@user_logging
def upload():
    data = None
    message = ''
    status_code = 400
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            data = None
            message = 'No file part!'
            status_code = 400

        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            data = None
            message = 'No selected file!'
            status_code = 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            filename = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

            # get term from file
            stat, terms = get_file_term(filename)
            if stat is False:
                data = None
                message = 'File has wrong format!'
                status_code = 400
            else:
                # get term records
                count = insert_new_word(terms)
                new_terms = NewTerm.objects(checked=False)[:100]

                data = []
                for term in new_terms:
                    data.append(new_term_toJSON(term))
                message = f'Successfully upload file with {count} new candidates!'
                status_code = 200
    return jsonify({
        'datas': data,
        'message': message
    }), status_code


@bp.route('/stat/<int:status>', methods=['GET', 'POST', 'DELETE'])
@user_logging
def stat(status):
    # status 0 為候選詞
    # status 1 為已加入新詞
    data = None
    message = ''
    status_code = 400
    if status == 0:
        
        if request.method == 'GET':
            page = request.args.get('page', 0, type=int)
            size = request.args.get('size', 50, type=int)

            terms = NewTerm.objects(checked=False)
            if page * size >= len(terms):
                data = None
                message = 'Request is out of range!'
                status_code = 400
            elif page * size + size > len(terms):
                terms = terms[page * size : len(terms) - 1]
            else:
                terms = terms[page * size : page * size + size]
            
            data = []
            for term in terms:
                data.append(new_term_toJSON(term))
            message = f'Successfully get page {page} candidates with size {size}'
            status_code = 200

        elif request.method == 'POST':
            checker = g.user
            term = request.form.get('tname', type=str)
            new_term = NewTerm.objects(tname=term)

            if new_term.first() is None:
                data = None
                message = f'Term {term} not found!'
                status_code = 404
            else:
                new_term.update_one(checked=True)
                if not hasattr(new_term, 'is_new_term'):
                    new_term.update_one(is_new_term=True)
                new_term.update_one(add_to_set__accepts=[checker])
                new_term = new_term.first()
                
                ### TODO: Add to term detail ###
                add_new_term = TermDetail(tname=term, word_length=len(term), pos=[], chuyin=[], 
                              creator=checker, frequency=new_term.frequency, aliases=[], related_synonym=[], antonym=[],
                              created=datetime.now(), view_cnt=0, edit_cnt=0, tags=[], imgs=[], meaning='')
                add_new_term.save()
                
                data = None
                message = f'Check {term} (New term)'
                status_code = 200
    
        elif request.method == 'DELETE':
            checker = g.user
            term = request.args.get('tname', type=str)
            new_term = NewTerm.objects(tname=term)

            if new_term.first() is None:
                data = None
                message = f'Term {term} not found!'
                status_code = 404
            else:
                new_term.update_one(checked=True)
                if not hasattr(new_term, 'is_new_term'):
                    new_term.update_one(is_new_term=False)
                new_term.update_one(add_to_set__rejects=[checker])
                new_term.first()
                
                data = None
                message = f'Check {term} (Not new term)'
                status_code = 200
    
        
    elif status == 1:
        if request.method == 'GET':
            page = request.args.get('page', 0, type=int)
            size = request.args.get('size', 50, type=int)

            terms = NewTerm.objects(checked=True, is_new_term=True)
            if page * size >= len(terms):
                data = None
                message = 'Request is out of range!'
                status_code = 400
            elif page * size + size > len(terms):
                terms = terms[page * size : len(terms)]
            else:
                terms = terms[page * size : page * size + size]
            
            data = []
            for term in terms:
                data.append(new_term_toJSON(term))
            message = f'Successfully get page {page} new term with size {size}'
            status_code = 200
        
    elif status == 2:
        if request.method == 'GET':
            page = request.args.get('page', 0, type=int)
            size = request.args.get('size', 50, type=int)

            terms = NewTerm.objects(checked=True, is_new_term=False)
            if page * size >= len(terms):
                data = None
                message = 'Request is out of range!'
                status_code = 400
            elif page * size + size > len(terms):
                terms = terms[page * size : len(terms)]
            else:
                terms = terms[page * size : page * size + size]
            
            data = []
            for term in terms:
                data.append(new_term_toJSON(term))
            message = f'Successfully get page {page} new term with size {size}'
            status_code = 200
        else:
            data = None
            message = 'Request error!'
            status_code = 400
            pass
    else:
        data = None
        message = 'Request error!'
        status_code = 400
    

    return jsonify({
        'datas': data,
        'message' : message,
    }), status_code