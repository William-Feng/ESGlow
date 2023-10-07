from flask import Flask

# User-defined module imports
from .database import db, bcrypt
from . import server, config


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI

    bcrypt.init_app(app)
    db.init_app(app)
    server.api.init_app(app)

    return app
