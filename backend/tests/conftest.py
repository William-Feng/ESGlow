import pytest
from sqlalchemy import create_engine, text
from src import config


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """ Setup for the entire session """
    url = 'postgresql://postgres:postgres@localhost:54321/postgres'
    engine = create_engine(url)

    conn = engine.connect()
    conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(f"CREATE DATABASE {config.TEST_DATABASE_NAME}"))
    conn.close()

    # Keep the setup until the end of all pytests
    yield

    conn = engine.connect()
    conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(f"DROP DATABASE IF EXISTS {config.TEST_DATABASE_NAME}"))
    conn.close()
