import { Box, Container, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import { overviewContainerStyle } from "../../../styles/componentStyle";

function ComparisonOverview({ token }) {
  const { selectedCompanies } = useContext(ComparisonViewContext);

  const [companyData, setCompanyData] = useState([]);
  const [portfolioRating, setPortfolioRating] = useState([]);
  const [bestPerformer, setBestPerformer] = useState(0);
  const [worstPerformer, setWorstPerformer] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCompanies.length === 0) {
          return;
        }

        // Fetch portfolio overview values
        let company_ids = selectedCompanies.map((c) => c.company_id).join(",");

        const response = await fetch(`/api/values/company/${company_ids}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        // Clear previous data before updating
        setCompanyData([]);

        const esgScores = selectedCompanies.map((company) => {
          const esgScore = data[company.company_id].value.ESGscore;
          const year = data[company.company_id].value.year;

          // Update companyData only for the selected companies
          setCompanyData((prevData) => [
            ...prevData,
            {
              company_id: company.company_id,
              name: company.name,
              score: esgScore,
              year: year,
            },
          ]);

          return esgScore;
        });

        if (esgScores.length === 0) {
          // No scores available
          setPortfolioRating();
          setBestPerformer();
          setWorstPerformer();
        } else {
          // Calculate average ESG score
          const totalScore = esgScores.reduce((sum, score) => sum + score, 0);
          const averageScore = totalScore / esgScores.length;
          setPortfolioRating(averageScore.toFixed(1));

          // Find best and worst performers
          setBestPerformer(Math.max(...esgScores));
          setWorstPerformer(Math.min(...esgScores));
        }
      } catch (error) {
        console.error("There was an error fetching the ESG scores.", error);
      }
    };

    fetchData();
  }, [token, selectedCompanies]);

  const toolTipStringIntro = `The Portfolio ESG Rating is calculated by averaging the most recent ESG scores of the selected companies:`;
  const toolTipStringList = companyData.map((item, index) => (
    <span key={index}>
      - {item.name}: <strong>{Math.round(item.score)}</strong> ({item.year})
    </span>
  ));

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        mx: "auto",
        mt: -3,
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
        {selectedCompanies.map((company, index) => (
          <span key={index}>
            {company.name}
            {index < selectedCompanies.length - 1 && (
              <span style={{ color: "gray", fontWeight: "normal" }}> | </span>
            )}
          </span>
        ))}
      </Typography>
      <Container sx={overviewContainerStyle}>
        <Box
          sx={{
            flex: 2.5,
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
              {portfolioRating}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" color="text.secondary">
                Portfolio ESG Rating
              </Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
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
              {bestPerformer.toFixed(1)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Best Performer
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
              {worstPerformer.toFixed(1)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Worst Performer
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

export default ComparisonOverview;
