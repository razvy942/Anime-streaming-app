from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

from backend.api.series_info import controller as series_controller
from backend.api.torrents import controller as torrent_controller
from backend.extensions import db

def create_app(config_object=None):
    app = Flask(__name__)
    app.config.from_pyfile(os.path.join('env.cfg'))
    register_extensions(app)
    register_blueprints(app)
    return app


def register_blueprints(app):
    app.register_blueprint(series_controller.bp)
    app.register_blueprint(torrent_controller.bp) 

def register_extensions(app):
    db.init_app(app)
    # db.create_all(app=app)
    CORS(app, resources={r"/*": {"origins": "*"}})


