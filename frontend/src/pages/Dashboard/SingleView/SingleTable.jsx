import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { SingleViewContext } from "./SingleView";
import DataRow from "../Components/Misc/DataRow";
import { tableCellStyle, tableCellTitleStyle } from "../../../styles/fontStyle";

export default function SingleTable({
  structuredData,
  structuredExtraData,
  hasDataToShow,
}) {
  const { selectedCompany, selectedYears, adjustedScore } =
    useContext(SingleViewContext);

  // Download data display table as CSV
  const handleDownloadCSV = () => {
    const data = [...structuredData, ...structuredExtraData];
    const csvContent = [
      "Indicator,Source," + selectedYears.join(","),
      ...data.map((row) => {
        const years = selectedYears.map((year) => row[year] || "");
        return [row.name, row.source, ...years].join(",");
      }),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const companyName = selectedCompany.name.replace(/\s+/g, "_");
    link.download = `${companyName}_ESG_Data.csv`;
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
              {selectedYears.map((year) => (
                <TableCell key={year} sx={tableCellStyle}>
                  {year}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {structuredData.map((row, index) => (
              <DataRow
                key={index}
                row={row}
                backgroundColor={index % 2 === 0 ? "#FAFAFA" : "#F5F5F5"}
                borderTopColor='#E0E0E0'
                hoverColor='#E5E5E5'
                selectedYears={selectedYears}
              />
            ))}
            {structuredExtraData.map((row, index) => (
              <DataRow
                key={`extra-${index}`}
                row={row}
                backgroundColor='#F0E5FF'
                borderTopColor='#D5C8FF'
                hoverColor='#E8D6FF'
                selectedYears={selectedYears}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 3,
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {adjustedScore && adjustedScore !== "0.0" ? (
            <>
              <Typography variant='h5' color='text.secondary'>
                Adjusted ESG Score:
              </Typography>
              <Typography variant='h5' fontWeight='bold' sx={{ ml: 2 }}>
                {adjustedScore}
              </Typography>
            </>
          ) : hasDataToShow ? (
            <Typography variant='h6' color='text.secondary'>
              Please click 'UPDATE SCORE' to display Adjusted ESG Score.
            </Typography>
          ) : null}
        </Box>
      </Box>
    </>
  );
}
