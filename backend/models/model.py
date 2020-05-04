from backend.extensions import db

association_table = db.Table('watch_queue',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('series_id', db.Integer, db.ForeignKey('series.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    watch_queue = db.relationship('Series', secondary=association_table, backref=db.backref('queue', lazy= 'dynamic'))

class Series(db.Model):
    __tablename__ = 'series'
    id = db.Column(db.Integer, primary_key=True)
    kitsu_id = db.Column(db.Integer, nullable=True)
    canonical_title = db.Column(db.String(120), nullable=True)
    en_title = db.Column(db.String(120), nullable=True)
    en_jp_title = db.Column(db.String(120), nullable=True)
    attributes = db.relationship('Attribute', uselist=False, backref='series')
    cover_image = db.relationship('CoverImage', uselist=False, backref='series') 
    poster_image = db.relationship('PosterImage', uselist=False, backref='series') 

class Attribute(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    synopsis = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    rating_rank = db.Column(db.Integer)
    favorites_count = db.Column(db.Integer)
    popularity_rank = db.Column(db.Integer)
    start_date = db.Column(db.String(15), nullable=True)
    end_date = db.Column(db.String(15))
    status = db.Column(db.Text)
    episode_count = db.Column(db.Integer)
    episode_length = db.Column(db.Integer)
    nsfw = db.Column(db.Boolean)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=False)
    #series = db.relationship("Series", back_populates="attributes")

class CoverImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    large = db.Column(db.Text)
    original = db.Column(db.Text)
    small = db.Column(db.Text)
    tiny = db.Column(db.Text)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=False)
    #series = db.relationship("Series", back_populates="cover_image")

class PosterImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    large = db.Column(db.Text)
    original = db.Column(db.Text)
    small = db.Column(db.Text)
    tiny = db.Column(db.Text)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=False)
    #series = db.relationship("Series", back_populates="poster_image")