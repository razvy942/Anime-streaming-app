from backend.extensions import db

class Series(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kitsu_id = db.Column(db.Integer, nullable=False)
    canonical_title = db.Column(db.String(120), unique=True, nullable=False)
    en_title = db.Column(db.String(120), unique=True, nullable=False)
    en_jp_title = db.Column(db.String(120), unique=True, nullable=False)
    attributes = db.relationship('Attributes', backref='series', lazy=True)
    watched_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Attributes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    synopsis = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=0)
    start_date = db.Column(db.String(15), nullable=False)
    end_time = db.Column(db.String(15))
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=False)