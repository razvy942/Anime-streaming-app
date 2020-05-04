from flask import request, jsonify, Blueprint
import json
import pprint
import requests
from difflib import SequenceMatcher

from backend.horrible_subs import horrible_parser
from backend.external_api_bindings import kitsu_bindings 
from backend.extensions import db
from backend.models.model import Series, Attribute, CoverImage, PosterImage

bp = Blueprint('SeriesInfo', __name__)
parser = horrible_parser.HorribleSubsParser()
kitsu = kitsu_bindings.Kitsu()

# TODO: Finish method to get new releases by date
@bp.route('/get-latest-releases')
def get_latest_releases():
    parser.get_latest()
    pass

@bp.route('/get-episodes')
def get_episodes():
    episodes = kitsu.get_episodes()
    return jsonify(episodes)

@bp.route('/get-characters')
def get_characters():
    characters = kitsu.get_characters()
    return jsonify(characters)

@bp.route('/get-airing')
def get_airing():
    shows = db.session.query(Series, Attribute).filter(Attribute.status == 'current').order_by(Series.canonical_title).join(Attribute).all()
    all_shows = []
    _construct_dict_from_tuple_array(all_shows, shows)
    return jsonify(all_shows)

@bp.route('/get-all/<page>')
def smth(page):
    offset_amount = (int(page) - 1) * 15
    shows = db.session.query(Series, PosterImage).order_by(Series.canonical_title).join(PosterImage).offset(offset_amount).limit(15)
    all_shows = []
    _construct_dict_from_tuple_array(all_shows, shows)
    return jsonify(all_shows)

@bp.route('/get-info/<id>')
def get_info(id):
    attributes = Attribute.query.get(int(id))
    del attributes.__dict__['_sa_instance_state']
    return jsonify(attributes.__dict__)

@bp.route('/search/<name>')
def search(name):
    search_term = f'%{name}%'
    shows_query = []
    shows_query.append(Series.query.filter(Series.canonical_title.like(search_term)).all())
    shows_query.append(Series.query.filter(Series.en_title.like(search_term)).all())
    shows_query.append(Series.query.filter(Series.en_jp_title.like(search_term)).all())

    all_shows = []
    seen = []
    for shows in shows_query:
        for show in shows:
            if show.kitsu_id in seen:
                continue
            show.__dict__.pop('_sa_instance_state', '')
            all_shows.append(show.__dict__)
            seen.append(show.kitsu_id)

    return jsonify(all_shows)

def _construct_dict_from_tuple_array(all_shows_arr, shows):
    for show_tuple in shows:
        del show_tuple[0].__dict__['_sa_instance_state']
        del show_tuple[1].__dict__['_sa_instance_state']
        show_tuple[0].__dict__['poster_image'] = show_tuple[1].__dict__

        all_shows_arr.append(show_tuple[0].__dict__)
