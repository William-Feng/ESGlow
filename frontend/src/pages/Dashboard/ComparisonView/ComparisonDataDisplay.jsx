import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";

const dummyCompanies = ["Google", "Apple"];
const dummyData = [{ name: "Indicator 1", Google: 90, Apple: 100 }];

function ComparisonDataDisplay({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  useEffect(() => {
    // prepare the indicatorIds list
    if (selectedCompanies && (selectedYear && selectedIndicators)) {
      const indicatorIds = selectedIndicators.join(",");

      selectedCompanies.forEach((c) => {
        fetch(`/api/values/${c.company_id}/${indicatorIds}/${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => response.json())
        .then((data) => {
          // do something with the data
          console.log(data)
        })
      })
    }
  }, [token, selectedCompanies, selectedYear, selectedIndicators]);

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
              {/* TODO: We need another column to display the year */}
              {dummyCompanies.map((company) => (
                <TableCell
                  key={company}
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
                  {company}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* TODO: We need to repeat this indicator info for all the selected years */}
            {dummyData.map((row, index) => (
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
                {/* TODO: This should be the row's company data for the specified year */}
                {dummyCompanies.map((year) => (
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
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default ComparisonDataDisplay;
