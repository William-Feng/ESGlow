# ESGlow Backend

## Code Structure

- `run.py`: Entry point for the Python Flask application.
- `src/`: Contains the main application logic.
  - `__init__.py`: Initialises the Flask application and its components.
  - `config.py`: Configuration settings for the application, primarily the database URL.
  - `database.py`: Sets up the database, ORM configurations, and user model.
  - `server.py`: Defines the main routes or endpoints for the application.
  - `user.py`: Contains all types of user functionality.
  - `reset.py`: Contains functionality for password reset and email verification.
- `tests/`: Contains pytests for the backend.

## Setup

### Prerequisites

- Ensure that you have downloaded and are currently using Python 3.11.0.
- After you have cloned the Git repository, navigate to the `backend/` directory.
- Install all the necessary dependencies by running:
  `pip install -r backend/requirements.txt`

### Startup the Backend

- Ensure that you have started up the PostgreSQL database using Docker _(see the `database/` directory)_.
- Navigate to the `backend/` directory.
- Start up the Python Flask backend by running:
  `python3 run.py`

### Running the Tests

- Navigate to the `backend/` directory.
- Execute the pytests by running:
  `pytest`
