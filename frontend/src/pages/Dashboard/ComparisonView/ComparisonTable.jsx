import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  tableCellStyle,
  tableCellTitleStyle,
  tableRowStyle,
  tableRowTitleStyle,
} from "../../../styles/fontStyle";

function ComparisonTable({ token }) {
  const {
    dataView,
    selectedCompanies,
    selectedYear,
    selectedIndicators,
    indicatorsList,
    yearsList,
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState({});

  useEffect(() => {
    if (selectedCompanies.length === 0 || selectedIndicators.length === 0) {
      return;
    }
    const indicatorIds = selectedIndicators.join(",");
    let yearsListString = yearsList.join(",");
    if (dataView === "table") {
      yearsListString = selectedYear[0];
    }
    const newData = {};
    const promisesList = [];

    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(
          `/api/values/${c.company_id}/${indicatorIds}/${yearsListString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values;
            dataValues.forEach((indicatorInfo) => {
              if (!newData[indicatorInfo.indicator_id]) {
                const indicator_source = indicatorsList.find(
                  (indicator) =>
                    indicator.indicator_id === indicatorInfo.indicator_id
                )?.indicator_source;
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
                  source: indicator_source,
                };
              }
              newData[indicatorInfo.indicator_id][c.company_id] =
                indicatorInfo.value;
            });
          })
          .catch((error) => {
            console.error(
              "Error fetching indicator values for company:",
              error
            );
          })
      );
    });

    Promise.all(promisesList)
      .then(() => {
        setCurrentData(newData);
      })
      .catch((error) => {
        console.error("Error fetching all indicator values:", error);
      });
  }, [
    token,
    selectedCompanies,
    selectedIndicators,
    selectedYear,
    indicatorsList,
    yearsList,
    dataView,
  ]);

  // Download data display table as CSV
  const handleDownloadCSV = () => {
    // Convert currentData to CSV content
    const header = [
      "Indicator",
      "Source",
      ...selectedCompanies.map((company) => company.name),
    ];
    const rows = Object.values(currentData).map((entry) => [
      entry.name,
      entry.source,
      ...selectedCompanies.map((company) => entry[company.company_id] || null),
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const companies = selectedCompanies
      .map((company) => company.name.replace(/\s+/g, "_"))
      .join("_");
    link.download = `${companies}_${selectedYear}_ESG_Data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={tableCellTitleStyle}>Indicator</TableCell>
              {selectedCompanies.map((company) => (
                <TableCell key={company.company_id} sx={tableCellStyle}>
                  {company.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(currentData).map(([index, row]) => (
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
                <TableCell sx={tableRowTitleStyle}>
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
                                component='span'
                                style={{ fontStyle: "italic" }}
                              >
                                {sourceNumber.trim()}:
                              </Typography>{" "}
                              <Typography
                                component='span'
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
                {selectedCompanies.map((company) => (
                  <TableCell key={company.company_id} sx={tableRowStyle}>
                    {row[company.company_id] || null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          sx={{
            pt: 3,
            display: "flex",
            float: "left",
          }}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={handleDownloadCSV}
            sx={{
              width: "150px",
              height: "55px",
              whiteSpace: "normal",
              textAlign: "center",
            }}
          >
            Download
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default ComparisonTable;
