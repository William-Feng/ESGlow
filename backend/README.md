# ESGlow Backend

## Setup

_Note that if you are using Docker, you can skip the following steps and simply run `./start.sh` in the root directory._

### Prerequisites

- Ensure that you have downloaded and are currently using Python 3.11.0.
- After you have cloned the Git repository, navigate to the `backend/` directory.
- Install all the necessary dependencies by executing:
  `pip install -r requirements.txt`

### Starting the Backend

- Ensure that you have started up the PostgreSQL database using Docker _(see the `database/` directory)_.
- Start up the Python Flask backend by executing:
  **`python3 run.py`**
- The backend should now be running at `http://127.0.0.1:5001`.

### Running the Tests

- Ensure that Docker has spun up the PostgreSQL database.
- Execute the pytests by executing:
  **`pytest`**
- This will start up a Docker container for a test database and run the provided tests within the tests, not affecting the production database.

## Code Structure

- `run.py`: Entry point for the Python Flask application.
- `src/`: Contains the main application logic.
  - `__init__.py`: Initialises the Flask application and its components.
  - `calculations.py`: Performs calculations related to entity metrics.
  - `config.py`: Configuration settings and constants for the application.
  - `database.py`: Sets up the database, ORM configurations, and user model.
  - `frameworks.py`: Contains functionality related to stored ESG data.
  - `models.py`: Documents the models for the endpoints through Swagger.
  - `reset.py`: Contains functionality for password reset and email verification.
  - `server.py`: Defines the main routes or endpoints for the application.
  - `user.py`: Contains all types of user functionality.
- `tests/`: Contains pytests for the backend.
- `requirements.txt`: Contains all the dependencies required for to run the backend.
