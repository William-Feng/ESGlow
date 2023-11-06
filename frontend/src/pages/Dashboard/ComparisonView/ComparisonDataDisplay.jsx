import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";

const dummyData = [{ name: "Indicator 1", Google: 90, Apple: 100 }];

function ComparisonDataDisplay({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState({})

  useEffect(() => {
    // prepare the indicatorIds list
    if ((selectedYear && selectedCompanies) && selectedIndicators.length > 0) {
      const indicatorIds = selectedIndicators.join(",");
      const newData = {}; // Create a copy of the currentData object

      selectedCompanies.forEach((c) => {
        fetch(`/api/values/${c.company_id}/${indicatorIds}/${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values
            // Assume that data is an object with indicator IDs as keys and scores
            // Update newData with the fetched data
            dataValues.forEach((indicatorInfo) => {
              if (!newData[indicatorInfo.indicator_id]) {
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
                };
              }
              newData[indicatorInfo.indicator_id][c.company_id] = indicatorInfo.value;
            });

            // Set newData in the state
            setCurrentData(newData);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, [token, selectedCompanies, selectedYear, selectedIndicators]);

  console.log(currentData)

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
              {selectedCompanies.map((company) => (
                <TableCell
                  key={company.company_id}
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
      </Box>
    </Box>
  );
}

export default ComparisonDataDisplay;
