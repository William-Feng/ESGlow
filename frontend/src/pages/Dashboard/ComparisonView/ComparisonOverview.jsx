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
          variant="h4"
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
                SCORE
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" color="text.secondary">
                  Portfolio ESG Rating
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
            {/* FIRST COLUMN: BEST AND WORST PERFORMERS */}
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
              <Typography variant="h5" color="text.primary" paragraph>
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
            {/* SECOND COLUMN: BEST AND WORST PERFORMERS */}
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
                90
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Best Performer
              </Typography>
              <Typography
                variant="h4"
                color="text.primary"
                sx={{ mt: "15px" }}
                paragraph
              >
                20
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Best Performer
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

  return true ? ( // this would use something equivalent to selectedCompany state
    renderCompanyData()
  ) : (
    <OverviewPrompt />
  );
}
