import pytest
from sqlalchemy import create_engine, text

from src import config


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    engine = create_engine(config.DEFAULT_DB_URI)

    # Disconnect all active connections to the esglow_test database
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'esglow_test'
            AND pid <> pg_backend_pid();
        """))
        # Drop and recreate esglow_test database
        conn.execute(text("DROP DATABASE IF EXISTS esglow_test"))
        conn.execute(text("CREATE DATABASE esglow_test"))

    # Keep the setup until the end of all pytests
    yield

    # Again, disconnect all active connections before dropping
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'esglow_test'
            AND pid <> pg_backend_pid();
        """))
        conn.execute(text("DROP DATABASE esglow_test"))
