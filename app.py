from backend import create_app
from backend.extensions import db

if __name__ == '__main__':
    app = create_app()
    app.run()