from flask import Flask
import pytest

from src import config, server
from src.database import db, bcrypt


def create_test_app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = config.TEST_DATABASE_URI

    bcrypt.init_app(app)
    db.init_app(app)
    server.api.init_app(app)

    return app


@pytest.fixture
def client():
    """
    Summary:
        This fixture initialises a Flask test client instance for simulating HTTP
        requests to the Flask application during testing. It also sets up a clean
        database state before each test by establishing an application context and
        ensures any changes are rolled back after each test to maintain test isolation.

    Yields:
        FlaskClient: An instance of the Flask test client.
    """

    app = create_test_app()

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_register_endpoint(client):
    data = {
        "email": "test@example.com",
        "password": "password123"
    }

    response = client.post('/register', json=data)
    assert response.status_code == 201
    assert b"User successfully registered." in response.data
