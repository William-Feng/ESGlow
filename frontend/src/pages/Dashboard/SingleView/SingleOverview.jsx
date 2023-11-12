import { Box, Container, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext, useEffect, useState } from "react";
import { SingleViewContext } from "./SingleView";
import OverviewPrompt from "../Components/Prompts/OverviewPrompt";

function SingleOverview({ token }) {
  const {
    selectedIndustry,
    selectedCompany,
    frameworksData,
    fixedIndicatorValues,
  } = useContext(SingleViewContext);

  const [industryMean, setIndustryMean] = useState(0);
  const [industryRanking, setIndustryRanking] = useState("");

  // Fetch industry mean and ranking
  useEffect(() => {
    fetch("/api/industries/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!selectedIndustry) {
          return;
        }
        const industryId = data.industries.indexOf(selectedIndustry) + 1;
        fetch(`/api/values/industry/${industryId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setIndustryMean(data.average_score);
          });
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the industry information.",
          error
        )
      );

    if (!selectedCompany) {
      return
    }
    fetch(`/api/values/ranking/company/${selectedCompany.company_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIndustryRanking(`${data.ranking}/${data.industry_company_count}`);
      });
    // eslint-disable-next-line
  }, [selectedCompany]);

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

  // Company has been selected, so display the company's details
  const renderCompanyData = () => {
    const scoreList = getRecentESGScores();
    const filteredFrameworksScores = scoreList.filter(
      (framework) =>
        framework.year === Math.max(...scoreList.map((f) => f.year))
    );

    // Assuming all objects have the same year
    const year = filteredFrameworksScores[0].year;
    const toolTipStringIntro =
      `The ESG Rating is calculated by averaging` +
      ` ${year} data of the following framework scores:\n`;

    const toolTipStringList = filteredFrameworksScores.map((item, index) => (
      <span key={index}>
        - {item.framework_name}: <strong>{item.score}</strong>
      </span>
    ));

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
          mt: -4,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          color="text.primary"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
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
            <Typography
              variant="body"
              color="text.primary"
              paragraph
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >
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
                    <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                      {toolTipStringIntro}
                      {toolTipStringList.map((str) => (
                        <Typography
                          variant="body2"
                          key={str}
                          sx={{
                            display: "block",
                            marginTop: "4px",
                            whiteSpace: "nowrap",
                            textIndent: "16px",
                            fontSize: "1rem",
                          }}
                        >
                          {str}
                        </Typography>
                      ))}
                    </Typography>
                  }
                  componentsProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "none",
                      },
                    },
                  }}
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
                {industryMean}
              </Typography>
              <Typography variant="h6" color="text.secondary" mt={-1}>
                Industry Mean
              </Typography>
              <Typography variant="h4" color="text.primary" mt={3} paragraph>
                {industryRanking}
              </Typography>
              <Typography variant="h6" color="text.secondary" mt={-1}>
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

  return frameworksData && selectedCompany ? (
    renderCompanyData()
  ) : (
    <OverviewPrompt />
  );
}

export default SingleOverview;
