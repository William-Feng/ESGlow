import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";

function ComparisonTable({ token }) {
  const {
    dataView,
    selectedCompanies,
    selectedYear,
    selectedIndicators,
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
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
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
    yearsList,
    dataView,
  ]);

  // Download data display table as CSV
  const handleDownloadCSV = () => {
    // Convert currentData to CSV content
    const header = [
      "Indicator",
      ...selectedCompanies.map((company) => company.name),
    ];
    const rows = Object.values(currentData).map((entry) => [
      entry.name,
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
              {selectedCompanies.map((company) => (
                <TableCell
                  key={company.company_id}
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.25em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    borderBottom: "2px solid",
                    textAlign: "center",
                  }}
                >
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
                <TableCell
                  sx={{
                    borderRight: "1px solid",
                    borderColor: "divider",
                    fontSize: "1.1em",
                  }}
                >
                  {row.name}
                </TableCell>
                {selectedCompanies.map((company) => (
                  <TableCell
                    key={company.company_id}
                    sx={{
                      borderRight: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      fontSize: "1.1em",
                    }}
                  >
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
            variant="contained"
            color="primary"
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
