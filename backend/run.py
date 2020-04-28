from flask import Flask
from flask_cors import CORS
import os

from api import routes, bp as horriblebp


app = Flask(__name__)
app.config.from_pyfile(os.path.join('env.cfg'))
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(horriblebp)

if __name__ == '__main__':
    app.run()