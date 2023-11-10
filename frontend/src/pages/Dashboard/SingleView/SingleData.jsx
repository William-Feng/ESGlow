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
    selectedAdditionalIndicators,
    savedAdditionalIndicatorWeights,
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

  // Only include the data for the selected frameworks, indicators and years
  const structuredData = useMemo(() => {
    const dataMap = {};

    filteredData.forEach((row) => {
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
  }, [allIndicators, filteredData]);

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

  // Adjusted ESG Score Calculation
  function calculateScore(
    savedWeights,
    filteredData,
    savedAdditionalIndicatorWeights,
    additionalIndicatorsData
  ) {
    let totalWeightSum = 0;
    let frameworkScore = 0;
    let additionalScore = 0;

    // Calculate total weight sum from savedWeights, and add the weights from the additional indicators
    if (savedWeights && savedWeights.metrics) {
      totalWeightSum += savedWeights.metrics.reduce(
        (accumulator, metric) => accumulator + metric.metric_weight,
        0
      );
    }

    Object.values(savedAdditionalIndicatorWeights).forEach((weight) => {
      totalWeightSum += weight;
    });

    // Calculate scores for the default framework
    // For each indicator within a metric, the score contribution is its value multiplied by its relative weight
    // within the metric, then multiplied by the metric's weight relative to the total weight sum.
    if (savedWeights && savedWeights.metrics) {
      frameworkScore = savedWeights.metrics.reduce((accumulator, metric) => {
        const totalIndicatorWeight = metric.indicators.reduce(
          (acc, indicator) => acc + indicator.indicator_weight,
          0
        );

        const metricScore = metric.indicators.reduce((acc, indicator) => {
          const matchingIndicator = filteredData.find(
            (data) =>
              data.indicator_id === indicator.indicator_id &&
              data.year === savedWeights.year
          );

          if (matchingIndicator) {
            const indicatorRelativeWeight =
              indicator.indicator_weight / totalIndicatorWeight;
            const indicatorScore =
              matchingIndicator.value *
              indicatorRelativeWeight *
              (metric.metric_weight / totalWeightSum);
            return acc + indicatorScore;
          }
          return acc;
        }, 0);

        return accumulator + metricScore;
      }, 0);
    }

    // Calculate scores for the additional indicators (note that these are not grouped into metrics)
    // For each, the score contribution is its value multiplied by its relative weight in the total weight sum.
    if (Object.keys(savedAdditionalIndicatorWeights).length > 0) {
      additionalScore = additionalIndicatorsData.reduce((accumulator, data) => {
        if (!savedWeights || savedWeights.year === data.year) {
          const weight =
            savedAdditionalIndicatorWeights[data.indicator_id.toString()] || 0;
          const normalizedWeight = weight / totalWeightSum;
          const indicatorScore = data.value * normalizedWeight;
          return accumulator + indicatorScore;
        }
        return accumulator;
      }, 0);
    }

    return frameworkScore + additionalScore;
  }

  // Invoke the score calculation function upon pressing the 'Update Score' button
  useEffect(() => {
    if (savedWeights || savedAdditionalIndicatorWeights) {
      const score = calculateScore(
        savedWeights,
        filteredData,
        savedAdditionalIndicatorWeights,
        additionalIndicatorsData
      );
      setAdjustedScore(score.toFixed(1));
    }
    // eslint-disable-next-line
  }, [savedWeights, savedAdditionalIndicatorWeights, additionalIndicatorsData]);

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
        {adjustedScore ? (
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
