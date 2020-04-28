from backend import db 

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)