import { Box, Container, Typography, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OverviewPrompt from "../Components/Prompts/OverviewPrompt";

export default function ComparisonOverview() {
  
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
          variant="h3"
          color="text.primary"
          gutterBottom
          textAlign="center"
        >
          COMPANY NAME
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
              COMPANY DESCRIPTION
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
                AVERAGE
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  ESG Rating
                </Typography>
                <Tooltip
                  title={
                    <Typography variant="body2">
                      SOME KIND OF INFORMATION
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

  return false // this would be dependent on company selected or not
    ? renderCompanyData()
    : <OverviewPrompt/>;
}
