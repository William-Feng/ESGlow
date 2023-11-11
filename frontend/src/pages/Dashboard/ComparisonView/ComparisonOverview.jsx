import { Box, Container, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OverviewPrompt from "../Components/Prompts/OverviewPrompt";
import { useContext } from "react";
import { ComparisonViewContext } from "./ComparisonView";

function ComparisonOverview() {
  const { selectedCompanies, portfolioRating, bestPerformer, worstPerformer } =
    useContext(ComparisonViewContext);

  // Company has been selected, so display the company's details
  const renderCompanyData = () => {
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
                      Calculated by averaging the ESG scores of each selected
                      company.
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
                {bestPerformer}
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
                {worstPerformer}
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
  };

  return selectedCompanies.length > 0 ? (
    renderCompanyData()
  ) : (
    <OverviewPrompt />
  );
}

export default ComparisonOverview;
