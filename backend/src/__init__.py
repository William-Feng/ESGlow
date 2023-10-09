from flask import Flask
from flask_jwt_extended import JWTManager
import os

# User-defined module imports
from .database import db, bcrypt
from . import server, config


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URL
    app.config['JWT_SECRET_KEY'] = os.urandom(32).hex()

    bcrypt.init_app(app)
    db.init_app(app)
    JWTManager.init_app(app)
    server.api.init_app(app)

    return app
