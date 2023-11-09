import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useContext } from "react";
import { SingleViewContext } from "./SingleView";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function SingleData() {
  const {
    selectedCompany,
    selectedFramework,
    selectedYears,
    indicatorValues,
    savedWeights,
    allIndicators,
    allIndicatorValues,
    selectedExtraIndicators,
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
        // Calculate the total sum of metric weights
        const totalMetricWeight = savedWeights.metrics.reduce(
          (accumulator, metric) => accumulator + metric.metric_weight,
          0
        );

        // Calculate the total sum of indicator weights for each metric
        savedWeights.metrics.forEach((metric) => {
          metric.metric_weight_total = metric.indicators.reduce(
            (accumulator, indicator) =>
              accumulator + indicator.indicator_weight,
            0
          );
        });

        const metricScores = savedWeights.metrics.map((metric) => {
          const metricScore = metric.indicators.reduce(
            (accumulator, indicator) => {
              const matchingIndicator = filteredData.find(
                (data) =>
                  data.indicator_id === indicator.indicator_id &&
                  data.year === savedWeights.year
              );

              if (matchingIndicator) {
                // Calculate pro-rata adjusted indicator weight
                const adjustedIndicatorWeight =
                  (matchingIndicator.value * indicator.indicator_weight) /
                  metric.metric_weight_total;

                return accumulator + adjustedIndicatorWeight;
              }

              return accumulator;
            },
            0
          );

          // Calculate pro-rata adjusted metric weight
          const adjustedMetricWeight =
            (metricScore * metric.metric_weight) / totalMetricWeight;

          return adjustedMetricWeight;
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
      console.log(row);
      if (!dataMap[row.indicator_id]) {
        const indicator_source = allIndicators.find(
          (indicator) => indicator.indicator_id === row.indicator_id
        ).indicator_source;
        dataMap[row.indicator_id] = {
          name: row.indicator_name,
          source: indicator_source,
        };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [filteredData]);

  // Retrieve the additional indicators and data selected by the user
  const extraIndicatorData = useMemo(
    () =>
      allIndicatorValues.filter((indicator) =>
        selectedExtraIndicators.includes(indicator.indicator_id)
      ),
    [selectedExtraIndicators, allIndicatorValues]
  );

  // Convert the extra indicator data into a format that can be displayed in the table
  const structuredExtraData = useMemo(() => {
    const dataMap = {};

    extraIndicatorData.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [extraIndicatorData]);

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
                  <Tooltip
                    title={row.source.split(";").map((source, index) => (
                      // Add line break to separate sources
                      <React.Fragment key={index}>
                        {source}
                        <br />
                      </React.Fragment>
                    ))}
                    sx={{ marginLeft: "4px" }}
                  >
                    <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                  </Tooltip>
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
