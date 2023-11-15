import { Box, Container, Typography, Tooltip, CircularProgress } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext } from "react";
import { SingleViewContext } from "./SingleView";
import useIndustryData from "../../../hooks/UseIndustryData";
import RecentESGScores from "../../../utils/RecentESGScores";
import { useESGScoresData } from "../../../hooks/UseGraphData";
import { overviewContainerStyle, overviewContentContainerStyle, overviewScoreContainerStyle } from "../../../styles/componentStyle";

function SingleOverview({ token }) {
  const {
    selectedIndustry,
    selectedCompany,
    frameworksData,
    fixedIndicatorValues,
  } = useContext(SingleViewContext);

  const { industryMean, industryRanking } = useIndustryData(
    token,
    selectedIndustry,
    selectedCompany
  );
  
  const { historicalEsgScores, EsgScoresYears } = useESGScoresData(
    token,
    selectedCompany
  );

  // Company has been selected, so display the company's details
  const renderCompanyData = () => {
    const scoreList = RecentESGScores(frameworksData, fixedIndicatorValues);
    const filteredFrameworksScores = scoreList.filter(
      (framework) =>
        framework.year === Math.max(...scoreList.map((f) => f.year))
    );

    const toolTipStringIntro = `The ESG Rating is calculated by averaging the most recent framework scores:\n`;
    const toolTipStringList = filteredFrameworksScores.map((item, index) => (
      <span key={index}>
        - {item.framework_name}: <strong>{item.score}</strong> ({item.year})
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
          mt: -3,
        }}
      >
        <Typography
          component='h1'
          variant='h4'
          color='text.primary'
          gutterBottom
          textAlign='center'
          fontWeight='bold'
        >
          {selectedCompany.name}
        </Typography>
        <Container sx={overviewContainerStyle}>
          <Box sx={{ flex: 1.2 }}>
            <Typography
              variant='body'
              color='text.primary'
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
              gap: 1,
            }}
          >
            <Box sx={overviewScoreContainerStyle}>
              <Typography variant='h2' color='text.primary' paragraph>
                {averageESGScore}
              </Typography>
              <Box display='flex' alignItems='center'>
                <Typography variant='h6' color='text.secondary'>
                  ESG Rating
                </Typography>
                <Tooltip
                  title={
                    <Typography variant='body2'>
                      {toolTipStringIntro}
                      {toolTipStringList.map((str) => (
                        <Typography
                          variant='body2'
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
            <Box sx={overviewContentContainerStyle}>
              <Box sx={overviewScoreContainerStyle}>
                <Typography variant='h4' color='text.primary' paragraph>
                  {industryMean.toFixed(1)}
                </Typography>
                <Typography variant='h6' color='text.secondary' mt={-1}>
                  Industry Mean
                </Typography>
              </Box>
              <Box sx={overviewScoreContainerStyle}>
                <Typography variant='h4' color='text.primary' paragraph>
                  {industryRanking}
                </Typography>
                <Typography variant='h6' color='text.secondary' mt={-1}>
                  Industry Ranking
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            {historicalEsgScores && historicalEsgScores.length > 0 ? (
              <LineChart
                width={300}
                height={220}
                series={[{ data: historicalEsgScores, label: "ESG Score" }]}
                xAxis={[{ scaleType: "point", data: EsgScoresYears }]}
              />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Container>
      </Box>
    );
  };

  return frameworksData && selectedCompany ? renderCompanyData() : null;
}

export default SingleOverview;
