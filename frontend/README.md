# ESGlow Frontend

## Code Structure

- `public/`: Contains the static files for the frontend.
- `src/`: Contains the main logic and is the heart of the React application.
  - `assets/`: Contains the ESGlow logo.
  - `hooks/`: Contain the custom hooks for shared logic and specifically for API calls to the backend.
    - `UseCompanyData.jsx`: Fetches a list of all the companies and companies based on the selected industry.
    - `UseComparisonData.jsx`: Fetches the historical ESG scores for a company, the average scores of indicators across companies, as well as the specific indicator data values structured for the table and graph views in comparison mode.
    - `UseCustomFrameworksData.jsx`: Fetches the custom frameworks saved by a user and deletes a specific custom framework.
    - `UseESGData.jsx`: Fetches the ESG data for a list of selected companies for comparison mode, including the calculation of the portfolio ESG rating, as well as the best and worst performer.
    - `UseFrameworksData`: Fetches all of the framework information related to a company, which consists of the metrics, indicators and data values over the years.
    - `UseIndicatorData`: Fetches all the indicator information related to a company over the years.
    - `UseIndustryData`: Fetches the list of industries and the companies within a specific industry, along with their respective rankings.
    - `UseYearsData`: Fetches the list of years for which data is available.
  - `pages/`: Contains the main components for the website, categorised into pages.
  - `styles/`: Contains the CSS files for styling the website.
    - `ComponentStyle.css`: Styles for various components (e.g. landing page, dashboard, data display sections).
    - `FontStyle.css`: Styles for specific fonts used within the components.
    - `ViewportSize.css`: Constants for the max-widths of viewports used for the media queries.
  - `utils/`: Contains the utility functions for specific tasks with more involved logic.
    - `RecentESGScore.jsx`: Calculates the ESG score for all the available frameworks for a specific company for the most recent year.
    - `ScoreCalculation.jsx`: Calculates the Adjusted ESG score based on the selected framework information, additional indicators
  - `App.jsx`: Contains the main React component that is rendered and acts as the root.

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
