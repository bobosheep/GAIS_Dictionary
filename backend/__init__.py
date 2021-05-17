import os

from flask import Flask, request, Response , render_template,url_for, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.routing import BaseConverter
from werkzeug.exceptions import HTTPException, InternalServerError

from . import auth, cat, admin, extension, term, db, nwd

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


def start_app(config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config['JSON_AS_ASCII'] = False
    app.config['DEBUG'] = config['DEBUG']
    app.config['SECRET_KEY'] = config['SECRET_KEY']
    app.config['UPLOAD_FOLDER'] = config['UPLOAD_FOLDER']
    app.config['DOWNLOAD_FOLDER'] = config['DOWNLOAD_FOLDER']
    app.config['ALLOWED_EXTENSIONS'] = config['ALLOWED_EXTENSIONS']
    if config['CORS']:
        CORS(app, supports_credentials=True)

    app.url_map.converters['regex'] = RegexConverter


    # Auth  begin w/ auth
    app.register_blueprint(auth.bp)


    # Category API begin w/ classes
    app.register_blueprint(cat.bp)



    # Extension API begin w/ extension
    app.register_blueprint(extension.bp)


    # Dictionary API
    app.register_blueprint(term.bp)

    # New Word API
    app.register_blueprint(nwd.bp)


    # Admin API  begin w/ admin
    app.register_blueprint(admin.bp)    

    @app.route("/<regex(r'(.*?)\.(svg|json|txt|png|ico|js|css|jpg)$'):file>", methods=["GET"])
    def public(file):
        return send_from_directory('static', file), 200
    @app.route('/', methods=['GET'])
    @app.route('/home', methods=['GET'])
    def mainpage():
        return render_template('index.html'), 200
    
    
    @app.errorhandler(HTTPException)
    def page_not_found(e):
        return render_template('index.html'), 404
    @app.errorhandler(InternalServerError)  
    def internal_error(e):
        return jsonify({
            'data': None,
            'message': 'Internal server error'
        }), 500

    return app
