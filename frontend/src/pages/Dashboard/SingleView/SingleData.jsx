import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useEffect, useMemo, useContext } from "react";
import { SingleViewContext } from "./SingleView";

function SingleData() {
  const {
    selectedCompany,
    selectedFramework,
    selectedYears,
    indicatorValues,
    savedWeights,
    allIndicatorValues,
    selectedAdditionalIndicators,
  } = useContext(SingleViewContext);
  const [adjustedScore, setAdjustedScore] = useState(0);

  const validIndicatorIds = selectedFramework
    ? selectedFramework.metrics.flatMap((metric) =>
        metric.indicators.map((indicator) => indicator.indicator_id)
      )
    : [];

  const filteredData = indicatorValues.filter((row) =>
    validIndicatorIds.includes(row.indicator_id)
  );

  // Display the new adjusted ESG score based on savedWeights
  useEffect(() => {
    if (savedWeights.metrics) {
      function calculateScore(savedWeights, filteredData) {
        const metricScores = savedWeights.metrics.map((metric) => {
          const metricScore = metric.indicators.reduce(
            (accumulator, indicator) => {
              const matchingIndicator = filteredData.find(
                (data) =>
                  data.indicator_id === indicator.indicator_id &&
                  data.year === savedWeights.year
              );

              if (matchingIndicator) {
                return (
                  accumulator +
                  matchingIndicator.value * indicator.indicator_weight
                );
              }

              return accumulator;
            },
            0
          );

          return metricScore * metric.metric_weight;
        });

        const finalScore = metricScores.reduce(
          (accumulator, metricScore) => accumulator + metricScore,
          0
        );
        return finalScore;
      }
      setAdjustedScore(calculateScore(savedWeights, filteredData).toFixed(1));
    }
    // eslint-disable-next-line
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

  // Retrieve the additional indicators and data selected by the user
  const additionalIndicatorsData = useMemo(
    () =>
      allIndicatorValues.filter((indicator) =>
        selectedAdditionalIndicators.includes(indicator.indicator_id)
      ),
    [selectedAdditionalIndicators, allIndicatorValues]
  );

  // Convert the additional indicator data into a format that can be displayed in the table
  const structuredExtraData = useMemo(() => {
    const dataMap = {};

    additionalIndicatorsData.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [additionalIndicatorsData]);

  const hasDataToShow = useMemo(
    () => selectedFramework || structuredExtraData.length > 0,
    [selectedFramework, structuredExtraData]
  );

  if (!selectedCompany || !hasDataToShow) {
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
          {selectedCompany
            ? "Please select a framework or at least one of the additional indicators to see the ESG data."
            : "Please select a company to see the ESG data."}
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
                  fontSize: "1.25em",
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
                    fontSize: "1.25em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    padding: "10px",
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
                  backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
                  borderTop: "1px solid #E0E0E0",
                  "&:hover": {
                    backgroundColor: "#E5E5E5",
                  },
                }}
              >
                <TableCell
                  sx={{
                    borderRight: "1px solid",
                    borderColor: "divider",
                    fontSize: "1.1em",
                  }}
                >
                  {row.name}
                </TableCell>
                {selectedYears.map((year) => (
                  <TableCell
                    key={year}
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      fontSize: "1.1em",
                    }}
                  >
                    {row[year] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {structuredExtraData.map((extraRow, index) => (
              <TableRow
                key={`extra-${index}`}
                sx={{
                  backgroundColor: "#F0E5FF",
                  borderTop: "1px solid #D5C8FF",
                  "&:hover": {
                    backgroundColor: "#E8D6FF",
                  },
                }}
              >
                <TableCell
                  sx={{
                    borderRight: "1px solid",
                    borderColor: "divider",
                    fontSize: "1.1em",
                  }}
                >
                  {extraRow.name}
                </TableCell>
                {selectedYears.map((year) => (
                  <TableCell
                    key={year}
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      fontSize: "1.1em",
                    }}
                  >
                    {extraRow[year] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          pt: 3,
          display: "flex",
          float: "right",
        }}
      >
        {selectedFramework && adjustedScore ? (
          <>
            <Typography variant="h5" color="text.secondary">
              Adjusted ESG Score:
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ ml: 2 }}>
              {adjustedScore}
            </Typography>
          </>
        ) : selectedFramework ? (
          <Typography variant="h5" color="text.secondary">
            Please make sure 'UPDATE SCORE' is clicked.
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export default SingleData;
