import {
  Box,
  Button
} from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import YearsSingleSelectAccordion from "./YearsSingleSelectAccordion";
import IndicatorsAccordion from "./IndicatorsAccordion";
import { ComparisonViewContext } from "./ComparisonView";

export const ComparisonSidebarContext = createContext();

function ComparisonSidebar() {
  const {
    years,
    selectedYear,
    setSelectedYear,
    allIndicators,
    selectedIndicators,
    setSelectedIndicators,
  } = useContext(ComparisonViewContext);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(years.find((y) => y === parseInt(year)));
  };

  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
  });
  
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  const handleIndicatorsChange = (indicatorId) => {
    setSelectedIndicators((prev) => {
      if (prev.includes(indicatorId)) {
        return prev.filter((id) => id !== indicatorId);
      } else {
        return [...prev, indicatorId];
      }
    });
  };

  return (
    <Box sx={{ paddingBottom: 3 }}>
      <ComparisonSidebarContext.Provider
        value={{
          years,
          selectedYear,
          handleYearChange,
          allIndicators,
          selectedIndicators,
          handleIndicatorsChange,
        }}
      >
        {/* Should modularize the indicators/weight Accordion to add here */}
        <YearsSingleSelectAccordion
          disabled={false} // Depending on some sort of selection
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
          years={years}
          handleYearChange={handleYearChange}
        />
        <IndicatorsAccordion
          disabled={false}
          expanded={expanded.panel2}
          onChange={handleChange("panel2")}
        />
      </ComparisonSidebarContext.Provider>
      <Box
        sx={{
          mt: 2,
          mr: 2,
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default ComparisonSidebar;
