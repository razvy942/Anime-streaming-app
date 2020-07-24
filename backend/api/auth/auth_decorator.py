from flask import request, jsonify
from functools import wraps
import jwt
import os

from backend.settings import SECRET_KEY

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('auth')
        if not token:
            return jsonify({'error': 'no token found'})
        try:
            jwt.decode(token, SECRET_KEY)
        except:
            return jsonify({'error': 'invalid token!'})
        return f(*args, **kwargs)
    return decorated