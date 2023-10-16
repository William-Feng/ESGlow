import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment } from "react";

export default function DataDisplay({ years, indicatorValues }) {
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
            {indicatorValues.map((row) => (
              <TableRow key={row.indicator_id}>
                <TableCell>{row.indicator_name}</TableCell>
                <TableCell>{row.year === 2023 ? row.value : null}</TableCell>
                <TableCell>{row.year === 2022 ? row.value : null}</TableCell>
                <TableCell>{row.year === 2021 ? row.value : null}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Fragment>
  );
}
