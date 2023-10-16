import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useMemo } from "react";

export default function DataDisplay({ years, indicatorValues }) {
  const structuredData = useMemo(() => {
    const dataMap = {};

    indicatorValues.forEach((row) => {
      if (!dataMap[row.indicator_id]) {
        dataMap[row.indicator_id] = { name: row.indicator_name };
      }
      dataMap[row.indicator_id][row.year] = row.value;
    });

    return Object.values(dataMap);
  }, [indicatorValues]);

  return (
    <Fragment>
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
              {years.map((year) => (
                <TableCell key={year}>{year}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {structuredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                {years.map((year) => (
                  <TableCell key={year}>{row[year] || null}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Fragment>
  );
}
