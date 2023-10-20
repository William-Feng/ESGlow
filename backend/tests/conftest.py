from flask import Flask
import pytest
import os
import time
from sqlalchemy import create_engine, text
from flask_jwt_extended import JWTManager, create_access_token

from tests.test_config import TEST_DATABASE_URL, TEST_DATABASE_NAME
from src import server
from src.database import db, bcrypt


@pytest.fixture(scope='session', autouse=True)
def start_docker():
    """
    Summary:
        Run the docker-compose for the test db
    """
    # Start the docker container
    current_script_directory = os.path.dirname(os.path.abspath(__file__))
    docker_compose_path = os.path.join(current_script_directory, '../../docker-compose-test.yml')

    os.system(f'docker-compose -f {docker_compose_path} up -d')
    
    yield
    
    # Stop the docker container
    os.system(f'docker-compose -f {docker_compose_path} down')


def wait_for_db(engine, retries=5, wait_time=5):
    """
    Summary:
        Wait for Docker to finish setting up the DB
    """
    for _ in range(retries):
        try:
            with engine.connect():
                return
        except:
            time.sleep(wait_time)
    raise Exception(f"Couldn't connect to the database after {retries} retries.")


@pytest.fixture(scope="session", autouse=True)
def setup_db(start_docker): # start_docker must be passed in to ensure it's executed first
    """
    Summary:
        Setup and teardown the test database.
    """

    engine = create_engine(TEST_DATABASE_URL)

    TERMINATE_ACTIVE_CONNECTIONS = f"""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{TEST_DATABASE_NAME}'
        AND pid <> pg_backend_pid();
    """

    wait_for_db(engine)

    # Create a temporary database for testing purposes
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(TERMINATE_ACTIVE_CONNECTIONS))
        conn.execute(
            text(f"DROP DATABASE IF EXISTS {TEST_DATABASE_NAME}"))
        conn.execute(text(f"CREATE DATABASE {TEST_DATABASE_NAME}"))       

    # Keep the setup until the end of all pytests
    yield

    # Drop the temporary database
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(TERMINATE_ACTIVE_CONNECTIONS))
        conn.execute(text(f"DROP DATABASE {TEST_DATABASE_NAME}"))

@pytest.fixture
def access_token():
    return create_access_token(identity="test_user")

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
    JWTManager(app)

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client_with_user(client):
    """
    Summary:
        This fixture consumes a Flask test client instance for simulating HTTP
        requests to the Flask application during testing. This client is then
        registered into the system and stored in the database.

    Yields:
        FlaskClient: An instance of the Flask test client that is now registered.
    """

    data = {
        "name": "Person",
        "email": "user1@example.com",
        "password": "password123"
    }

    # Register one user
    client.post('/api/register', json=data)
    yield client


@pytest.fixture
def client_with_frameworks():
    app = create_test_app()
    JWTManager(app)

    with app.app_context():
        db.create_all()
        with open("tests/test_database/2_insert_data.sql", "r") as f:
            insert_data_sql = f.read()
            for statement in insert_data_sql.split(';'):
                if statement.strip():  # ensure the statement is not empty
                    db.session.execute(text(statement))
            db.session.commit()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def create_test_app():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = TEST_DATABASE_URL
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'

    bcrypt.init_app(app)
    db.init_app(app)
    server.api.init_app(app)

    return app
