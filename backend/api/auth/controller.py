from flask import request, jsonify, Blueprint, request
import bcrypt 

from backend.models import model

bp = Blueprint('Register', __name__)

@bp.route('/login')
def login():
    pass

@bp.route('/register', methods=['POST'])
def create_user():
    username = request.values.get('username')
    password = request.values.get('password')

    print(username)
    return jsonify({'hai': 'hao'})
    