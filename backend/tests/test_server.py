import pytest

from src import create_app, config
from src.database import db


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

    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = config.TEST_DATABASE_URI

    # Establish an application context before running the tests.
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()


def test_register_endpoint(client):
    data = {
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post('/register', json=data)
    assert response.status_code == 201
    assert b"User successfully registered." in response.data
