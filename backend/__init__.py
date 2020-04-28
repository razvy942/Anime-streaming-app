from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# from api import routes, bp as horriblebp
from api.series_info import controller as series_controller
from api.torrents import controller as torrent_controller

app = Flask(__name__)
app.config.from_pyfile(os.path.join('env.cfg'))
CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)
db.create_all()

app.register_blueprint(series_controller.bp)
app.register_blueprint(torrent_controller.bp) 