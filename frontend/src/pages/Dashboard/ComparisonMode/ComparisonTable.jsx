import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { ComparisonModeContext } from "./ComparisonMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useComparisonTableData } from "../../../hooks/UseComparisonData";
import {
  tableCellStyle,
  tableCellTitleStyle,
  tableRowStyle,
  tableRowTitleStyle,
} from "../../../styles/FontStyle";

function ComparisonTable({ token }) {
  const {
    dataView,
    selectedCompanies,
    selectedYear,
    selectedIndicators,
    indicatorsList,
    yearsList,
  } = useContext(ComparisonModeContext);

  const currentData = useComparisonTableData(
    token,
    selectedCompanies,
    selectedIndicators,
    selectedYear,
    indicatorsList,
    yearsList,
    dataView
  );

  // Download data display table as CSV
  const handleDownloadCSV = () => {
    // Convert currentData to CSV content
    const header = [
      "Indicator",
      "Source",
      ...selectedCompanies.map((company) => company.name),
    ];
    const rows = Object.values(currentData).map((entry) => [
      entry.name,
      entry.source,
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
              <TableCell sx={tableCellTitleStyle}>Indicator</TableCell>
              {selectedCompanies.map((company) => (
                <TableCell key={company.company_id} sx={tableCellStyle}>
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
                <TableCell sx={tableRowTitleStyle}>
                  {row.name}
                  <Tooltip
                    title={
                      <React.Fragment>
                        {row.source.split(";").map((source, index) => {
                          // Splitting the source string into three parts: the source number, name and description
                          const [sourceNumber, sourceRest] =
                            source.split(/:(.+)/);
                          const [sourceName, sourceDescription] =
                            sourceRest.split(/\((.+)/);

                          return (
                            <div
                              key={index}
                              style={{
                                marginBottom:
                                  index < row.source.split(";").length - 1
                                    ? 10
                                    : 0,
                              }}
                            >
                              <Typography
                                component="span"
                                style={{ fontStyle: "italic" }}
                              >
                                {sourceNumber.trim()}:
                              </Typography>{" "}
                              <Typography
                                component="span"
                                style={{ fontWeight: "bold" }}
                              >
                                {sourceName.trim()}
                              </Typography>
                              {" (" + sourceDescription.trim()}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    }
                    sx={{ marginLeft: "4px" }}
                  >
                    <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                  </Tooltip>
                </TableCell>
                {selectedCompanies.map((company) => (
                  <TableCell key={company.company_id} sx={tableRowStyle}>
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
