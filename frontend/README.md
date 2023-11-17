# ESGlow Frontend

## Code Structure

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
  - `Dashboard/`: Components that make up the bulk of the ESGlow Dashboard, accessible once a user logs in.
    - `ComparisonMode/`: Components that are relevant if the user is in comparison mode, where multiple companies can be selected.
      - `ComparisonDataDisplay.jsx`: Displays a table or graph depending on the specified view, or a prompt to provide guidance for users if the requirements have not been satisfied.
      - `ComparisonGraph.jsx`: Displays a line graph of the selected indicators for the selected companies over the years, with the option to show the benchmark average and the ability to download the graph as a SVG file.
      - `ComparisonMode.jsx`: Parent component for comparison mode.
      - `ComparisonOverview.jsx`: Displays the portfolio ESG rating, best and worst performer, and a portfolio breakdown using a bar chart.
      - `ComparisonSearchbar.jsx`: Displays an input field for searching up to 3 companies to add to the comparison.
      - `ComparisonSidebar.jsx`: Displays a sidebar that consists of the switch between table & graph view, as well as the years and indicators accordion.
      - `ComparisonTable.jsx`: Displays a table of the selected indicator data for the specified year across the portfolio of companies, along with the data source and the ability to download the table as a CSV file.
    - `Components/`: Various components that are used across the dashboard
      - `Accordion/`: All the accordions that are defined, serving different purposes and possessing distinct styles.
        - `AdditionalIndicatorsAccordion.jsx`: Displays all the indicators that were not part of the selected framework in single mode, along with their descriptions and the ability to modify their weights if selected for personalisation.
        - `FrameworkAccordion.jsx`: Displays all the default frameworks that are available for a company as well as the user's created custom frameworks in single mode, along with their descriptions.
        - `IndicatorsAccordion.jsx`: Displays all the available indicators for selection in comparison mode, along with their descriptions.
        - `MetricsIndicatorsAccordion.jsx`: Displays all the metrics and indicators that are part of the selected framework in single mode, along with their descriptions and the ability to modify respective weights if selected for personalisation.
        - `MultiSelectAccordion.jsx`: Displays a generic accordion that allows the user to select multiple checkboxes from a list of options, specifically for single mode.
        - `OverviewAccordion.jsx`: Displays company information clearly in both single and comparison mode, highlighting the key ESG ratings, performance over the years, industry ranks and charts.
        - `YearsRangeAccordion.jsx`: Displays all the available years for selection via a range slider in comparison mode, specifically for graph view.
        - `YearsSingleAccordion.jsx`: Displays all the available years for selection via radio buttons in comparison mode, specifically for table view.
      - `Misc/`: Miscellaneous components that are used to help abstract away some of the logic in other major components.
        - `DataRow.jsx`: Displays a row of data for the table in single mode, showing the indicator name, data source and values over the years.
        - `Header.jsx`: Displays a header that appears at the very top of the dashboard, showing the ESGlow logo and the user profile icon, where the latter allows the user to manage their custom frameworks log out.
        - `ManageCustomFrameworks.jsx`: Displays a modal that allows the user to manage their custom frameworks, specifically to view those that have been created and the option to delete them.
        - `SidebarSaveButtons.jsx`: Displays the 'Save Custom Framework' and 'Update Score' buttons that appear at the bottom of the sidebar in single mode.
        - `SnackbarManager.jsx`: Displays a snackbar that is applicable in various use cases as it can change positions and handle both a success or an error message.
        - `ToggleDataView.jsx`: Displays a toggle button group within the sidebar to allows users to switch between the table and chart/graph view in both single and comparison mode.
    - `SingleMode/`: Components that are relevant if the user is in single mode, where a company within an industry is selected.
      - `SingleBarChart.jsx`: Displays a clustered bar chart of the selected indicators over the selected years
      - `SingleDataDisplay.jsx`: Displays a table or chart depending on the specified view, or a prompt to provide guidance for users if the requirements have not been satisfied.
      - `SingleMode.jsx`: Parent component for single mode.
      - `SingleOverview.jsx`: Displays the company's description, ESG rating across its frameworks, the industry mean and ranking, and its performance over the years using a line graph.
      - `SingleSearchbar.jsx`: Displays two input fields to select an industry and then a company for analysis.
      - `SingleSidebar.jsx`: Displays a sidebar that consists of the switch between table & bar chart view, as well as the frameworks, metrics & indicators (for non-custom frameworks), additional indicators and years accordions.
      - `SingleTable.jsx`: Displays a table of the selected indicator data for the specified year, along with the data source and the ability to download the table as a CSV file.
    - `Dashboard.jsx`: Parent component for the dashboard, to differentiate between single and comparison mode.
  - `Login/`: Components that make up the user authentication and login page.
    - `ResetPassword/`: Components for the reset password screens.
      - `ResetInputEmail.jsx`: Displays an input field for the user to enter their email address to receive a reset password link.
      - `ResetNew.jsx`: Displays an input field for the user to enter and set their new password.
      - `ResetSuccess.jsx`: Displays a success message to the user after they have successfully reset their password.
      - `ResetVerify.jsx`: Displays an input field for the user to enter the verification code sent to their email address.
    - `Landing.jsx`: Landing page and home screen of ESGlow, where the logo and company mission statement are displayed on the left hand side, and the login screens are shown on the right.
    - `Login.jsx`: Displays an input field for the user to enter their email address and password to login to view the dashboard, with the ability to reset their password.
    - `Register.jsx`: Displays an input field for new users to enter their email address and password to register for an account.
- `styles/`: Contains the CSS files for styling the website.
  - `ComponentStyle.css`: Styles for various components, including the landing page, dashboard and data display sections.
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
