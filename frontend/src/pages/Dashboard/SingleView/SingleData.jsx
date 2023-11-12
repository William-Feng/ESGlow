import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useMemo, useContext, useCallback } from "react";
import { SingleViewContext } from "./SingleView";
import DataRow from "../Components/DataRow";

function SingleData() {
  const {
    selectedCompany,
    selectedFramework,
    selectedYears,
    allIndicators,
    filteredData,
    additionalIndicatorsData,
    adjustedScore,
  } = useContext(SingleViewContext);

  // Convert the indicator data into a format that can be displayed in the table
  const processIndicatorData = useCallback(
    (data) => {
      const dataMap = {};

      data.forEach((row) => {
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
    },
    [allIndicators]
  );

  // Data for the selected frameworks and indicators over the years
  const structuredData = useMemo(
    () => processIndicatorData(filteredData),
    [processIndicatorData, filteredData]
  );

  // Data for the selected additional indicators data over the years
  const structuredExtraData = useMemo(
    () => processIndicatorData(additionalIndicatorsData),
    [processIndicatorData, additionalIndicatorsData]
  );

  // Determine if there is data to show based on the selected framework and additional indicators
  const hasDataToShow = useMemo(
    () => selectedFramework || structuredExtraData.length > 0,
    [selectedFramework, structuredExtraData]
  );

  // Display a prompt if the user has not selected a company or there is no data to show
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
            ? "Please select a framework or at least one of the additional indicators to view the ESG data."
            : "Please select a company from the search bar above to view its details and the ESG data."}
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
              <DataRow
                key={index}
                row={row}
                backgroundColor={index % 2 === 0 ? "#FAFAFA" : "#F5F5F5"}
                borderTopColor="#E0E0E0"
                hoverColor="#E5E5E5"
                selectedYears={selectedYears}
              />
            ))}
            {structuredExtraData.map((row, index) => (
              <DataRow
                key={`extra-${index}`}
                row={row}
                backgroundColor="#F0E5FF"
                borderTopColor="#D5C8FF"
                hoverColor="#E8D6FF"
                selectedYears={selectedYears}
              />
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
        {adjustedScore && adjustedScore !== "0.0" ? (
          <>
            <Typography variant="h5" color="text.secondary">
              Adjusted ESG Score:
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ ml: 2 }}>
              {adjustedScore}
            </Typography>
          </>
        ) : hasDataToShow ? (
          <Typography variant="h5" color="text.secondary">
            Please make sure the 'UPDATE SCORE' button is clicked.
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export default SingleData;
