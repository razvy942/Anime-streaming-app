import os
from flask import Flask, Blueprint
from flask_cors import CORS, cross_origin
import json
from HorribleSubs import horribleParser
from NyaaPantsu import nyaaApi
from ApiBindings import jikan as jikanApi, kitsu as kitsuApi


# app = Flask(__name__)
bp = Blueprint("HorribleSubs", __name__)
# app.config.from_pyfile(os.path.join('..', 'env.cfg'))
# CORS(app, resources={r"/*": {"origins": "*"}})

# TODO: database setup, etc...
with open('kitsu-db.json') as db:
    series_db = json.load(db)

def paginate_series_db(series_db):
    # each page should contain 10 elements
    items = series_db.items()
    current_page = 1
    paginated_db = {}
    for i in range(len(items)-1, 15, -15):
        paginated_db[current_page] = dict( list(items)[i-15 : i] )
        current_page += 1

    return paginated_db
pg_db = paginate_series_db(series_db)

parser = horribleParser.HorribleSubsParser()
nyaa = nyaaApi.NyaaPantsu()
jikan = jikanApi.Jikan()
kitsu = kitsuApi.Kitsu()

from HorribleSubs import routes

