from flask import request, jsonify, Blueprint, request, make_response
import jwt
import datetime

from backend.api.auth.auth_decorator import token_required
from backend.models.model import User
from backend.extensions import bcrypt, db
from backend.settings import SECRET_KEY


bp = Blueprint('Register', __name__)

@bp.route('/test')
@token_required 
def test():
    token = request.cookies.get('auth')
    data = jwt.decode(token, SECRET_KEY)
    user = data['user']
    return jsonify({'message': f'Welcome back {user}!'})

@bp.route('/login', methods=['GET'])
def login():
    # content = request.get_json()
    # username = content.get('username')
    username = 'razvy942'
    # password = content.get('password')

    # user = User.query.filter_by(username=username).first()
    # if not user:
    #     return jsonify({'error': 'User doesn\'t exist!'})
    # if not bcrypt.check_password_hash(user.password, password):
    #     return jsonify({'error': 'Incorrect password!'})
    token = jwt.encode({'user': username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY)

    res = make_response({'message': 'welcome'}, 200)
    res.set_cookie('auth', token, httponly=True)
    return res

@bp.route('/register', methods=['POST'])
def create_user():
    username = request.form.get('username')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists!'})
    if not password == confirm_password:
        return jsonify({'error': 'Passwords must match!'})
    hashed_password = bcrypt.generate_password_hash(password, rounds=10)
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': f'User {username} succesfully created!'})
    