from flask import Flask

# User-defined module imports
from .database import db, bcrypt
from . import server
from .config import Config


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_URL
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY

    bcrypt.init_app(app)
    db.init_app(app)
    server.jwt.init_app(app)
    server.api.init_app(app)

    return app
