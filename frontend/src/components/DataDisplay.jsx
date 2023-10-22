import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

export default function DataDisplay({
  selectedYears,
  filteredData
}) {

  // Only include the data for the selected frameworks, indicators and years
  const structuredData = useMemo(() => {
    if (filteredData['error']) {
      return
    }
    const dataMap = {};

    filteredData.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });
    console.log(Object.values(dataMap));
    return Object.values(dataMap);
  }, [filteredData]);

  if (filteredData['error']) {
    const keyword = filteredData['error']
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Please select a {keyword} to see the ESG data.
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
                  fontSize: "1.1em",
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
                    fontSize: "1.1em",
                    background: "#D1EFFF",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    padding: "15px",
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
                  backgroundColor: index % 2 === 0 ? "#F5F5F5" : "#E0E0E0",
                }}
              >
                <TableCell
                  sx={{ borderRight: "1px solid", borderColor: "divider" }}
                >
                  {row.name}
                </TableCell>
                {selectedYears.map((year) => (
                  <TableCell
                    key={year}
                    sx={{
                      borderRight:
                        index !== selectedYears.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      textAlign: "center",
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
