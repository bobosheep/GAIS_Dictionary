import os

from flask import Flask, request, Response , render_template,url_for, jsonify, send_from_directory, send_file
from flask_cors import CORS
from werkzeug.routing import BaseConverter

from . import auth, cat

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


def start_app(config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    if config['CORS']:
        CORS(app)
    app.config['JSON_AS_ASCII'] = False
    app.debug = config['DEBUG']
    app.config['SECRET_KEY'] = config['SECRET_KEY']

    app.url_map.converters['regex'] = RegexConverter


    # Auth
    app.register_blueprint(auth.bp)
    tokens = auth.tokens


    # Category API
    app.register_blueprint(cat.bp)



    # Extension API


    # Dictionary API

    

    # Other API
    
    @app.route("/<regex(r'(.*?)\.(json|txt|png|ico|js|css|jpg)$'):file>", methods=["GET"])
    def public(file):
        return send_from_directory('static', file)     
    @app.route('/', methods=['GET'])
    @app.route('/home', methods=['GET'])
    def mainpage():
        return render_template('index.html')
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('index.html'), 404
    

    return app