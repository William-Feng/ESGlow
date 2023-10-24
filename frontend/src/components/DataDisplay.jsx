import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";

export default function DataDisplay({
  selectedCompany,
  selectedFramework,
  selectedYears,
  indicatorValues,
  savedWeights
}) {
  const [adjustedScore, setAdjustedScore] = useState(0);

  const validIndicatorIds = selectedFramework
  ? selectedFramework.metrics.flatMap((metric) =>
      metric.indicators.map((indicator) => indicator.indicator_id)
    )
  : [];

  const filteredData = indicatorValues.filter((row) =>
    validIndicatorIds.includes(row.indicator_id)
  );
  console.log(savedWeights)

  // display the new adjusted ESG score based on savedWeights
  useEffect(() => {
    if (savedWeights.metrics) {
      function calculateScore(savedWeights, filteredData) {
        const metricScores = savedWeights.metrics.map((metric) => {
          const metricScore = metric.indicators.reduce((accumulator, indicator) => {
            const matchingIndicator = filteredData.find(
              (data) =>
                data.indicator_id === indicator.indicator_id && data.year === savedWeights.year
            );
      
            if (matchingIndicator) {
              return accumulator + matchingIndicator.value * indicator.indicator_weight;
            }
      
            return accumulator;
          }, 0);
      
          return metricScore * metric.metric_weight;
        });
      
        const finalScore = metricScores.reduce((accumulator, metricScore) => accumulator + metricScore, 0);
        return finalScore;
      }
      setAdjustedScore(calculateScore(savedWeights, filteredData).toFixed(1));
    }
  }, [savedWeights]);
  

  // Only include the data for the selected frameworks, indicators and years
  const structuredData = useMemo(() => {
    const dataMap = {};

    filteredData.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [filteredData]);

  if (!(selectedFramework && selectedCompany)) {
    const keyword = selectedCompany ? "framework" : "company";
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          bgcolor: "#f5f5f5",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please select a {keyword} to see the ESG data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: "0 20px 24px",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1em",
                  background: "#D1EFFF",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  padding: "15px",
                  borderBottom: "2px solid",
                }}
              >
                Indicator
              </TableCell>
              {selectedYears.map((year) => (
                <TableCell
                  key={year}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    padding: "15px",
                    borderBottom: "2px solid",
                    textAlign: "center",
                  }}
                >
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {structuredData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#E0E0E0",
                }}
              >
                <TableCell
                  sx={{ borderRight: "1px solid", borderColor: "divider" }}
                >
                  {row.name}
                </TableCell>
                {selectedYears.map((year) => (
                  <TableCell
                    key={year}
                    sx={{
                      borderRight:
                        index !== selectedYears.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      textAlign: "center",
                    }}
                  >
                    {row[year] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          margin: "10px",
          display: "flex",
          float: "right",
        }}
      >
        <Typography variant="h5">Adjusted ESG Score:</Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          textAlign="center"
          sx={{ ml: "10px" }}
        >
          {adjustedScore}
        </Typography>
      </Box>
    </Box>
  );
}
