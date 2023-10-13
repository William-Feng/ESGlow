import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

function createData(metric, year1, year2, year3) {
  return { metric, year1, year2, year3 };
}
const rows = [
  createData('Metric A', 100, 200, 300),
  createData('Metric B', 10, 12, 10),
  createData('Metric C', 50, 75, 100),
  createData('Metric D', 5, 7, 10),
  createData('Metric E', 200, 190, 100),
  createData('Metric F', 50, 75, 100),
  createData('Metric G', 50, 75, 100),
  createData('Metric H', 50, 75, 100),
  createData('Metric I', 50, 75, 100),
  createData('Metric J', 50, 75, 100),
  createData('Metric K', 50, 75, 100),
]

export default function DataDisplay() {
  return (
    <React.Fragment>
      <Box sx={{ml: '260px', mt: '20px'}}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell>2023</TableCell>
              <TableCell>2022</TableCell>
              <TableCell>2021</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.metric}>
                <TableCell>{row.metric}</TableCell>
                <TableCell>{row.year1}</TableCell>
                <TableCell>{row.year2}</TableCell>
                <TableCell>{row.year3}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
}