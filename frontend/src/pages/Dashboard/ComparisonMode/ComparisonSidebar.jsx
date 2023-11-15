import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import YearsSingleAccordion from "../Components/Accordion/YearsSingleAccordion";
import YearsRangeAccordion from "../Components/Accordion/YearsRangeAccordion";
import IndicatorsAccordion from "../Components/Accordion/IndicatorsAccordion";
import { ComparisonModeContext } from "./ComparisonMode";
import ToggleDataView from "../Components/Misc/ToggleDataView";

function ComparisonSidebar({ token }) {
  const {
    selectedCompanies,
    selectedIndicators,
    setSelectedIndicators,
    dataView,
    setDataView,
  } = useContext(ComparisonModeContext);

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
      <ToggleDataView
        disabled={!selectedCompanies.length}
        setDataView={setDataView}
        dataView={dataView}
        otherViewTitle={"Graph View"}
      />
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
