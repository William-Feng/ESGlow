import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Overview({
  frameworksData,
  indicatorValues
}) {
  console.log("overview", indicatorValues)

  const calculateESG = () => {
    if (!frameworksData) {
      return 0
    }
    let scoreList = [];

    // Iterate over the frameworks in the array.
    frameworksData.forEach((framework) => {

      let frameworkScore = 0; // Declare frameworkScore here.
    
      framework.metrics.forEach((metric) => {

        const { predefined_weight, indicators } = metric;

        // Create a map to store the most recent indicator values by indicator_id
        const mostRecentIndicatorValues = new Map();

        indicatorValues.forEach((indicatorValue) => {
          if (!mostRecentIndicatorValues.has(indicatorValue.indicator_id) ||
              indicatorValue.year > mostRecentIndicatorValues.get(indicatorValue.indicator_id).year) {
            mostRecentIndicatorValues.set(indicatorValue.indicator_id, indicatorValue);
          }
        });

        // Calculate the metric score for this metric
        const metricScore = indicators.reduce((accumulator, indicator) => {
          const indicatorValue = indicatorValues.find((value) => value.indicator_id === indicator.indicator_id);
          if (!indicatorValue) {
            return accumulator + 0
          }
          const indicatorScore = indicatorValue.value * indicator.predefined_weight;
          return accumulator + indicatorScore;
        }, 0);
    
        frameworkScore += predefined_weight * metricScore;

      });
      scoreList.push(Math.round(frameworkScore));
    });
    return scoreList;
  }

  const ESGScoreList = calculateESG();
  const ESGScore = ESGScoreList.reduce(
    (accumulator, currentValue) => accumulator + currentValue.score, 0)
     / ESGScoreList.length;

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
        Company Name
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
          <Typography variant="h5" color="text.secondary" paragraph>
            Summary of company's ESG reporting...
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
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
              {ESGScore}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ESG Rating
            </Typography>
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
}
