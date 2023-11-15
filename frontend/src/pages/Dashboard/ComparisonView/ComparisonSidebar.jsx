import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import YearsSingleAccordion from "../Components/Accordion/YearsSingleAccordion";
import YearsRangeAccordion from "../Components/Accordion/YearsRangeAccordion";
import IndicatorsAccordion from "../Components/Accordion/IndicatorsAccordion";
import { ComparisonViewContext } from "./ComparisonView";

function ComparisonSidebar({ token }) {
  const {
    selectedCompanies,
    selectedIndicators,
    setSelectedIndicators,
    dataView,
    setDataView,
  } = useContext(ComparisonViewContext);

  useEffect(() => {
    // Close accordions upon clearing companies selection
    if (selectedCompanies.length === 0) {
      setExpanded({
        panel1: false,
        panel2: false,
      });
    } else {
      setExpanded({
        panel1: true,
        panel2: false,
      });
    }
  }, [token, selectedCompanies]);

  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: false,
  });

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  const handleIndicatorsChange = (indicatorId) => {
    if (dataView === "graph") {
      // In graph view, only allow one indicator to be selected
      setSelectedIndicators([indicatorId]);
    } else {
      // In table view, allow multiple indicators to be selected
      setSelectedIndicators((prev) => {
        if (prev.includes(indicatorId)) {
          return prev.filter((id) => id !== indicatorId);
        } else {
          return [...prev, indicatorId];
        }
      });
    }
  };

  useEffect(() => {
    // When switching to graph view, select only the indicator with the smallest ID
    if (dataView === "graph" && selectedIndicators.length > 1) {
      const smallestIndicatorId = Math.min(...selectedIndicators);
      setSelectedIndicators([smallestIndicatorId]);
    }
  }, [dataView, selectedIndicators, setSelectedIndicators]);

  return (
    <Box sx={{ paddingBottom: 3 }}>
      <Box
        sx={{
          backgroundColor:
            selectedCompanies.length > 0 ? "transparent" : "#D7D7D7",
          textAlign: "center",
          p: "15px",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <ToggleButtonGroup
          value={dataView}
          exclusive
          disabled={!selectedCompanies.length}
          onChange={(e) => setDataView(e.currentTarget.value)}
          aria-label="table view"
          sx={{
            backgroundColor: "#E8E8E8",
            m: "auto",
          }}
        >
          <ToggleButton
            value="table"
            sx={{
              backgroundColor: dataView === "table" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography variant="body4">Table View</Typography>
          </ToggleButton>
          <ToggleButton
            value="graph"
            sx={{
              backgroundColor: dataView === "graph" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography variant="body4">Graph View</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {dataView === "graph" ? (
        <YearsRangeAccordion
          disabled={selectedCompanies.length === 0}
          expanded={expanded.panel1}
          onToggleDropdown={handleChange("panel1")}
        />
      ) : (
        <YearsSingleAccordion
          disabled={selectedCompanies.length === 0}
          expanded={expanded.panel1}
          onToggleDropdown={handleChange("panel1")}
        />
      )}
      <IndicatorsAccordion
        multi={dataView !== "graph"}
        disabled={selectedCompanies.length === 0}
        expanded={expanded.panel2}
        onToggleDropdown={handleChange("panel2")}
        handleIndicatorsChange={handleIndicatorsChange}
      />
    </Box>
  );
}

export default ComparisonSidebar;
