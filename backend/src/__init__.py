from flask import Flask
from flask_jwt_extended import JWTManager

# User-defined module imports
from .database import db, bcrypt
from . import server, config


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URL
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY

    bcrypt.init_app(app)
    db.init_app(app)
    JWTManager(app)
    server.api.init_app(app)

    return app