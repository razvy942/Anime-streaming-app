from flask import request, jsonify
import json
import pprint

from HorribleSubs import bp, pg_db, series_db, parser, nyaa, jikan


@bp.route('/horriblesubs/get-all', methods=['GET'])
def get_main_page():
    # shows = parser.get_all_shows()
    current_page = int(request.args.get('page', '1'))

    return jsonify(pg_db[current_page])


@bp.route('/horriblesubs/get-latest')
def get_latest_releases():
    parser.get_current_season_releases()
    with open('series-db.json') as db:
        latest_db = json.load(db)
    # Add show information to the show dict
    info = {}

    for key in parser.current_season:
        if key in latest_db:
            info[key] = latest_db[key]
        else:
            info[key] = {'desc': 'null', 'img': 'null'}

    return jsonify(info)


@bp.route('/horriblesubs/get-show/<title>')
def get_show(title):
    info = jikan.search(title)
    # info[title] = series_db[title]

    return jsonify(info)


# TODO: Create database to store shows and their links in for easier search
@bp.route('/horriblesubs/search')
def search_horriblesubs():
    show_name = request.args.get('q')
    show = {show_name: parser.shows_dict.get(show_name, 'not found')}
    return jsonify(show)

@bp.route('/horriblesubs/get-episodes/<mal_id>')
def get_episodes(mal_id):
    episodes = jikan.get_episodes(mal_id)
    return jsonify(episodes)

@bp.route('/horriblesubs/get-episode/<title>/<episode_number>')
def get_ep(title, episode_number):
    shows = nyaa.get_magnet(title, episode_number)
    return jsonify(shows)
