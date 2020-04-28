from flask import request, jsonify, Blueprint
import json
import pprint
import requests
from difflib import SequenceMatcher

from horrible_subs import horrible_parser
from api_bindings import kitsu_bindings 
from api import pg_db

bp = Blueprint('SeriesInfo', __name__)
parser = horrible_parser.HorribleSubsParser()
kitsu = kitsu_bindings.Kitsu()

@bp.route('/get-all', methods=['GET'])
def get_main_page():
    current_page = int(request.args.get('page', '1'))
    return jsonify(pg_db[current_page])

@bp.route('/get-latest-releases')
def get_latest_releases():
    parser.get_latest()
    pass

@bp.route('/get-current-season')
def get_current_season():
    parser.get_current_season_releases()
    data = {}
    append_data = False
    new_data = {}
    
    for show in parser.current_season:
        data[show] = series_db.get(show, '')
        # If the show is not in local database, query kitsu api
        if series_db.get(show, '') == '':
            append_data = True
            new_info = requests.get(f'https://kitsu.io/api/edge/anime?filter%5Btext%5D={show}').json()['data']
            # Just check the first 2 hits, if we check anymore the accuracy seems to decrease
            if (len(new_info) > 1):
                title1 = new_info[0]['attributes']['canonicalTitle']
                title2 = new_info[1]['attributes']['canonicalTitle']
                if SequenceMatcher(None, show, title1).ratio() > SequenceMatcher(None, show, title2).ratio():
                    data[show] =  new_info[0]
                else:
                    data[show] = new_info[1]
            else:
                data[show] =  new_info[0]
            
            # New data to append to db
            new_data[show] = data[show]
        # TODO: update local databse aswell
      
    if (append_data == True):
        for i in new_data:
           series_db.update({ i: new_data[i] })
        with open('kitsu-db.json', 'w') as db:
            print('appending new data...')
            json.dump(series_db, db)

    return jsonify(data)

# TODO: Create database to store shows and their links in for easier search
@bp.route('/search')
def search_horriblesubs():
    show_name = request.args.get('q')
    show = {show_name: parser.shows_dict.get(show_name, 'not found')}
    return jsonify(show)


@bp.route('/get-info/<title>')
def get_info(title):
    info = kitsu.search(title)
    data = {}
    #info = kitsu.get_info()
    # data['episodes'] = kitsu.get_episodes()
    # data['characters'] = kitsu.get_characters()

    return jsonify(info)

@bp.route('/get-episodes')
def get_episodes():
    episodes = kitsu.get_episodes()
    return jsonify(episodes)

@bp.route('/get-characters')
def get_characters():
    characters = kitsu.get_characters()
    return jsonify(characters)