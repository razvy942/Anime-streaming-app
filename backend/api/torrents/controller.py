from flask import Blueprint, jsonify

from backend.nyaa import nyaa_scraper
from backend.models.model import Series

bp = Blueprint('TorrentInfo', __name__)
nyaa_scrap = nyaa_scraper.NyaaScraper()

@bp.route('/get-episode/<id>/<episode_number>')
def get_ep(id, episode_number):
    # shows = nyaa.get_magnet(title, episode_number)
    show = Series.query.get(id)
    if episode_number == 'movie':
        info = nyaa_scrap.search(show.en_title, episode_number, is_movie=True)
    else:
        info = nyaa_scrap.search(f'{show.en_title} - {episode_number}', episode_number)
  
    return jsonify({id: info})
