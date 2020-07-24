from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

from backend.api.series_info import controller as series_controller
from backend.api.torrents import controller as torrent_controller
from backend.api.auth import controller as auth_controller
from backend.extensions import db, bcrypt

def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_pyfile(os.path.join('env.cfg'))
    register_extensions(app)
    register_blueprints(app)
    app.config['SESSION_COOKIE_SECURE'] = True
    # with app.app_context():
    #     db.create_all()
    return app

def register_blueprints(app):
    app.register_blueprint(series_controller.bp, url_prefix='/api')
    app.register_blueprint(torrent_controller.bp, url_prefix='/api/torrent') 
    app.register_blueprint(auth_controller.bp, url_prefix='/api') 

def register_extensions(app):
    db.init_app(app)
    bcrypt.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}})


