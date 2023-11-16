import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { ComparisonModeContext } from "./ComparisonMode";
import ComparisonTable from "./ComparisonTable";
import ComparisonGraph from "./ComparisonGraph";
import {
  dataDisplayContainerStyle,
  dataDisplayPlaceholderStyle,
} from "../../../styles/componentStyle";

function ComparisonDataDisplay({ token }) {
  const { dataView, selectedCompanies, selectedYear, selectedIndicators } =
    useContext(ComparisonModeContext);

  if (
    selectedCompanies.length === 0 ||
    selectedIndicators.length === 0 ||
    (!selectedYear.length && dataView === "table")
  ) {
    return (
      <Box sx={dataDisplayPlaceholderStyle}>
        <Typography variant="h6" color="text.secondary">
          {selectedCompanies.length === 0
            ? "Please select at least one company to view the ESG data."
            : dataView === "table" && selectedYear.length === 0
            ? "Please select a year to view the ESG data."
            : dataView === "table"
            ? "Please select at least one indicator to view the ESG data."
            : "Please select one indicator to view the ESG data"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={dataDisplayContainerStyle}>
      {dataView === "table" ? (
        <ComparisonTable token={token} />
      ) : (
        <ComparisonGraph token={token} />
      )}
    </Box>
  );
}

export default ComparisonDataDisplay;
