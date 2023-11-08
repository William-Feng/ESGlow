import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useContext, createContext, useEffect, useState } from "react";
import { ComparisonViewContext } from "./ComparisonView";

export const ComparisonDataViewContext = createContext();

function ComparisonDataDisplay({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  const [currentData, setCurrentData] = useState({})

  useEffect(() => {
    if ((!selectedYear || selectedCompanies.length === 0) || selectedIndicators.length === 0) {
      return;
    }
    const indicatorIds = selectedIndicators.join(",");
    const newData = {};

    const promisesList = [];
    
    selectedCompanies.forEach((c) => {
      promisesList.push(
        fetch(`/api/values/${c.company_id}/${indicatorIds}/${selectedYear}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const dataValues = data.values
            dataValues.forEach((indicatorInfo) => {
              if (!newData[indicatorInfo.indicator_id]) {
                newData[indicatorInfo.indicator_id] = {
                  name: indicatorInfo.indicator_name,
                };
              }
              newData[indicatorInfo.indicator_id][c.company_id] = indicatorInfo.value;
            });
          })
          .catch((error) => {
            console.error("Error fetching indicator values for company:", error);
          })
      )
    });

    Promise.all(promisesList)
    .then(() => {
      setCurrentData(newData)
    })
    .catch((error) => {
      console.error("Error fetching all indicator values:", error);
    })

  }, [token, selectedCompanies, selectedYear, selectedIndicators]);

  if (selectedCompanies.length === 0 || !selectedYear || selectedIndicators.length === 0) {
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
          {selectedCompanies.length === 0
            ? "Please select one or more companies to see the ESG data."
            : !selectedYear
            ? "Please select a year to see the ESG data."
            : "Please select one or more indicators to see the ESG data"
          }
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
