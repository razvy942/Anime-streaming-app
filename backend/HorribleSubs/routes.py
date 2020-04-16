from flask import request, jsonify
import json
import pprint

from HorribleSubs import bp, pg_db, series_db, parser, nyaa, jikan, kitsu


@bp.route('/horriblesubs/get-all', methods=['GET'])
def get_main_page():
    # shows = parser.get_all_shows()
    current_page = int(request.args.get('page', '1'))

    return jsonify(pg_db[current_page])


@bp.route('/horriblesubs/get-latest')
def get_latest_releases():
    parser.get_current_season_releases()
    

    return jsonify(parser.current_season)

@bp.route('/horriblesubs/get-current-season')
def get_current_season():
    pass

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

# @bp.route('/horriblesubs/get-episodes/<mal_id>')
# def get_episodes(mal_id):
#     episodes = jikan.get_episodes(mal_id)
#     return jsonify(episodes)

@bp.route('/horriblesubs/get-episode/<title>/<episode_number>')
def get_ep(title, episode_number):
    shows = nyaa.get_magnet(title, episode_number)
    return jsonify(shows)

@bp.route('/horriblesubs/get-info/<title>')
def get_info(title):
    info = kitsu.search(title)
    data = {}
    #info = kitsu.get_info()
    # data['episodes'] = kitsu.get_episodes()
    # data['characters'] = kitsu.get_characters()

    return jsonify(info)

@bp.route('/horriblesubs/get-episodes')
def get_episodes():
    episodes = kitsu.get_episodes()
    return jsonify(episodes)

@bp.route('/horriblesubs/get-characters')
def get_characters():
    characters = kitsu.get_characters()
    return jsonify(characters)