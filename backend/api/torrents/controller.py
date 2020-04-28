from flask import Blueprint, jsonify

from backend.nyaa import nyaa_scraper

bp = Blueprint('TorrentInfo', __name__)
nyaa_scrap = nyaa_scraper.NyaaScraper()

@bp.route('/get-episode/<title>/<episode_number>')
def get_ep(title, episode_number):
    # shows = nyaa.get_magnet(title, episode_number)
    if episode_number == 'movie':
        info = nyaa_scrap.search(title, episode_number, is_movie=True)
    else:
        info = nyaa_scrap.search(f'{title} - {episode_number}', episode_number)
  
    return jsonify({title: info})