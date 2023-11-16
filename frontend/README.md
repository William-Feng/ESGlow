# ESGlow Frontend

## Code Structure

- `public/`: Contains the static files for the frontend.
- `src/`: Contains the main logic and is the heart of the React application.

## Setup

_Note that if you are using Docker, you can skip the following steps and simply run `./start.sh` in the root directory._

### Prerequisites

- Ensure that you have downloaded and are currently using Node 21.1.0 and npm 10.2.3.
- After you have cloned the Git repository, navigate to the `frontend/` directory.
- Install all the necessary dependencies by running:
  `npm install`

### Startup the Frontend

- Ensure that you have started up the PostgreSQL database using Docker _(see the `database/` directory)_.
- Ensure that you have started up the backend server _(see the `backend/` directory)_.
- Navigate to the `frontend/` directory.
- Start up the React frontend by running:
  `npm start`
- The website should now be running on `http://localhost:3000`.
