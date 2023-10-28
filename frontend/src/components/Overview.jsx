import { Box, Container, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext } from "react";
import { PageContext } from "./Dashboard";

function Overview() {
  const { selectedCompany, frameworksData, fixedIndicatorValues } =
    useContext(PageContext);
  const getRecentESGScores = () => {
    if (!frameworksData) {
      return [];
    }
    let ESGScoreList = [];

    // Iterate over the frameworks in the array.
    frameworksData.forEach((framework) => {
      let frameworkScore = 0;
      const { framework_name } = framework;

      // Map to store the most recent year's indicator values by indicator_id
      const mostRecentIndicatorValues = new Map();

      // Iterate through fixedIndicatorValues to find the most recent values for each indicator_id
      fixedIndicatorValues.forEach((indicatorValue) => {
        if (
          !mostRecentIndicatorValues.has(indicatorValue.indicator_id) ||
          indicatorValue.year >
            mostRecentIndicatorValues.get(indicatorValue.indicator_id).year
        ) {
          mostRecentIndicatorValues.set(
            indicatorValue.indicator_id,
            indicatorValue
          );
        }
      });

      // Calculate each metric score
      framework.metrics.forEach((metric) => {
        const { predefined_weight, indicators } = metric;
        const metricScore = indicators.reduce((accumulator, indicator) => {
          const indicatorValue = mostRecentIndicatorValues.get(
            indicator.indicator_id
          );

          if (indicatorValue) {
            const indicatorScore =
              indicatorValue.value * indicator.predefined_weight;
            return accumulator + indicatorScore;
          }

          return accumulator;
        }, 0);

        frameworkScore += predefined_weight * metricScore;
      });

      // Find most recent year and only calculate values based on that year
      const mostRecentYear = [...mostRecentIndicatorValues.values()].reduce(
        (maxYear, indicatorValue) => {
          return Math.max(maxYear, indicatorValue.year);
        },
        -Infinity
      );

      ESGScoreList.push({
        framework_name,
        year: mostRecentYear,
        score: Math.round(frameworkScore),
      });
    });

    return ESGScoreList;
  };

  // Company hasn't been selected, so inform the user to select a company
  const renderPrompt = () => (
    <Box
      sx={{
        display: "flex",
        padding: "32px 0",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "34.5vh",
        bgcolor: "#f5f5f5",
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        color="text.secondary"
        paragraph
        textAlign="center"
      >
        Please select a company from the search bar above to view its details.
      </Typography>
    </Box>
  );

  // Company has been selected, so display the company's details
  const renderCompanyData = () => {
    const scoreList = getRecentESGScores();
    const filteredFrameworksScores = scoreList.filter(
      (framework) =>
        framework.year === Math.max(...scoreList.map((f) => f.year))
    );

    const year = filteredFrameworksScores[0].year; // Assuming all objects have the same year
    const toolTipStringIntro =
      `The ESG Score was calculated by averaging` +
      ` ${year} data of the following framework scores:\n`;

    const toolTipStringList = filteredFrameworksScores.map(
      (item) => `- ${item.framework_name}: ${item.score}`
    );

    const mostRecentYearScores = filteredFrameworksScores.map(
      (framework) => framework.score
    );
    const averageESGScore = (
      mostRecentYearScores.reduce((sum, score) => sum + score, 0) /
      mostRecentYearScores.length
    ).toFixed(1);

    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          mx: "auto",
          padding: "16px 0",
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          color="text.primary"
          gutterBottom
          textAlign="center"
        >
          {selectedCompany.name}
        </Typography>
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            alignItems: "center",
            border: 1,
            borderRadius: 4,
            padding: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" paragraph>
              {selectedCompany.description}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1.5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h2" color="text.primary" paragraph>
                {averageESGScore}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  ESG Rating
                </Typography>
                <Tooltip
                  title={
                    <Typography variant="body2">
                      {toolTipStringIntro}
                      {toolTipStringList.map((str) => (
                        <Typography
                          variant="body3"
                          sx={{ textIndent: "20px" }}
                          key={str}
                        >
                          <br />
                          {str}
                        </Typography>
                      ))}
                    </Typography>
                  }
                >
                  <InfoOutlinedIcon
                    style={{ cursor: "pointer", paddingLeft: 3 }}
                  />
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="text.primary" paragraph>
                43
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Industry Mean
              </Typography>
              <Typography
                variant="h5"
                color="text.primary"
                sx={{ margin: "24px 0px" }}
                paragraph
              >
                24/185
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Industry Ranking
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              textAlign="center"
            >
              Chart
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  };

  return frameworksData && selectedCompany
    ? renderCompanyData()
    : renderPrompt();
}

export default Overview;
