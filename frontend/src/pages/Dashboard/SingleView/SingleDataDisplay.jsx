import {
  Box,
  Typography,
} from "@mui/material";
import React, { useMemo, useContext, useCallback } from "react";
import { SingleViewContext } from "./SingleView";
import {
  dataDisplayContainerStyle,
  dataDisplayPlaceholderStyle,
} from "../../../styles/componentStyle";
import SingleTable from "./SingleTable";
import SingleBarChart from "./SingleBarChart";

function SingleDataDisplay() {
  const {
    selectedCompany,
    selectedFramework,
    allIndicators,
    filteredData,
    additionalIndicatorsData,
    dataView,
  } = useContext(SingleViewContext);

  // Convert the indicator data into a format that can be displayed in the table
  const processIndicatorData = useCallback(
    (data) => {
      const dataMap = {};

      data.forEach((row) => {
        if (!dataMap[row.indicator_id]) {
          const indicator_source = allIndicators.find(
            (indicator) => indicator.indicator_id === row.indicator_id
          )?.indicator_source;
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
      <Box sx={dataDisplayPlaceholderStyle}>
        <Typography variant='h6' color='text.secondary'>
          {selectedCompany
            ? "Please select a framework or at least one of the additional indicators to view the ESG data."
            : "Please select a company to view the ESG data."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={dataDisplayContainerStyle}>
      {dataView === "table" ? (
        <SingleTable
          structuredData={structuredData}
          structuredExtraData={structuredExtraData}
          hasDataToShow={hasDataToShow}
        />
      ) : (
        <SingleBarChart/>
      )}
    </Box>
  );
}

export default SingleDataDisplay;
