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
import React, { useMemo, useContext, useCallback } from "react";
import { SingleViewContext } from "./SingleView";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
        {/* TODO: There is duplication between normal data and the additional data, abstract into separate component */}
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {row.name}
                  <Tooltip
                    title={
                      <React.Fragment>
                        {row.source.split(";").map((source, index) => {
                          // Splitting the source string into three parts: the source number, name and description
                          const [sourceNumber, sourceRest] =
                            source.split(/:(.+)/);
                          const [sourceName, sourceDescription] =
                            sourceRest.split(/\((.+)/);

                          return (
                            <div
                              key={index}
                              style={{
                                marginBottom:
                                  index < row.source.split(";").length - 1
                                    ? 10
                                    : 0,
                              }}
                            >
                              <Typography
                                component="span"
                                style={{ fontStyle: "italic" }}
                              >
                                {sourceNumber.trim()}:
                              </Typography>{" "}
                              <Typography
                                component="span"
                                style={{ fontWeight: "bold" }}
                              >
                                {sourceName.trim()}
                              </Typography>
                              {" (" + sourceDescription.trim()}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    }
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {extraRow.name}
                  <Tooltip
                    title={
                      <React.Fragment>
                        {extraRow.source.split(";").map((source, index) => {
                          // Splitting the source string into three parts: the source number, name and description
                          const [sourceNumber, sourceRest] =
                            source.split(/:(.+)/);
                          const [sourceName, sourceDescription] =
                            sourceRest.split(/\((.+)/);

                          return (
                            <div
                              key={index}
                              style={{
                                marginBottom:
                                  index < extraRow.source.split(";").length - 1
                                    ? 10
                                    : 0,
                              }}
                            >
                              <Typography
                                component="span"
                                style={{ fontStyle: "italic" }}
                              >
                                {sourceNumber.trim()}:
                              </Typography>{" "}
                              <Typography
                                component="span"
                                style={{ fontWeight: "bold" }}
                              >
                                {sourceName.trim()}
                              </Typography>
                              {" (" + sourceDescription.trim()}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    }
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
            Please make sure 'UPDATE SCORE' is clicked.
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

export default SingleData;
