import {
  Box,
  Container,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext } from "react";
import { ComparisonModeContext } from "./ComparisonMode";
import { overviewContainerStyle } from "../../../styles/componentStyle";
import useESGData from "../../../hooks/UseESGData";
import { BarChart } from "@mui/x-charts";

function ComparisonOverview({ token }) {
  const { selectedCompanies } = useContext(ComparisonModeContext);

  const { companyData, portfolioRating, bestPerformer, worstPerformer } =
    useESGData(token, selectedCompanies);

  const toolTipStringIntro = `The Portfolio ESG Rating is calculated by averaging the most recent ESG ratings of the selected companies:`;
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

        <Box sx={{ flex: 1, position: "relative" }}>
          {companyData.length ? (
            <>
              <Typography
                variant="h6"
                color="text.primary"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Portfolio Breakdown
              </Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: companyData.map((c) => c.name),
                    tickLabelStyle: {
                      fontSize: 8,
                    },
                  },
                ]}
                series={[
                  {
                    data: companyData.map((c) =>
                      parseFloat(c.score.toFixed(1))
                    ),
                  },
                ]}
                width={420}
                height={250}
              />
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default ComparisonOverview;
