# ESGlow Backend Setup

This provides a brief guide on how to set up the ESGlow Python Flask backend.

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
