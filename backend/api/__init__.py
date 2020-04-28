import os
from flask import Flask, Blueprint
from flask_cors import CORS, cross_origin
import json

from horrible_subs import horrible_parser
from nyaa import nyaa_scraper
from api_bindings import kitsu_bindings 


bp = Blueprint("HorribleSubs", __name__)

parser = horrible_parser.HorribleSubsParser()
nyaa_scrap = nyaa_scraper.NyaaScraper()
kitsu = kitsu_bindings.Kitsu()

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





