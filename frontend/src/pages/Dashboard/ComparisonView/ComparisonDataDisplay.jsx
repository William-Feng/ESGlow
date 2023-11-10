import {
  Box,
  Typography
} from "@mui/material";
import { useContext } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import ComparisonTable from "./ComparisonTable";
import ComparisonGraph from "./ComparisonGraph";

function ComparisonDataDisplay({ token }) {
  const {
    dataView,
    selectedCompanies,
    selectedYear,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

  if (
    selectedCompanies.length === 0
    || selectedIndicators.length === 0
    || (!selectedYear.length && dataView === 'table')
  ) {
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
            : (dataView === 'table' && selectedYear.length === 0)
            ? "Please select a year to see the ESG data."
            : "Please select one or more indicators to see the ESG data"}
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
      {dataView === 'table' ? (
        <ComparisonTable token={token}/>
      ) : (
        <ComparisonGraph token={token}/>
      )}
    </Box>
  );
}

export default ComparisonDataDisplay;
