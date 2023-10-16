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
  selectedFramework,
  selectedYears,
  indicatorValues,
}) {
  const validIndicatorIds = selectedFramework
    ? selectedFramework.metrics.flatMap((metric) =>
        metric.indicators.map((indicator) => indicator.indicator_id)
      )
    : [];

  const filteredData = indicatorValues.filter((row) =>
    validIndicatorIds.includes(row.indicator_id)
  );

  const structuredData = useMemo(() => {
    const dataMap = {};

    filteredData.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [filteredData]);

  if (!selectedFramework) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
      >
        <Typography variant="h6" color="textSecondary">
          Please select a framework to see the ESG data
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: "20px",
        ml: "20px",
        mr: "20px",
        overflowX: "auto",
        width: "100%",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Indicator</TableCell>
            {selectedYears.map((year) => (
              <TableCell key={year}>{year}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {structuredData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              {selectedYears.map((year) => (
                <TableCell key={year}>{row[year] || null}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
