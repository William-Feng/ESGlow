import {
  Box,
  Button
} from "@mui/material";
import { createContext, useState } from "react";
import YearsSingleSelectAccordion from "./YearsSingleSelectAccordion";

export const ComparisonSidebarContext = createContext();

function ComparisonSidebar() {
  /* These are dummy variables for placeholder */
  const years = [2020, 2023];
  const [selectedYear, setSelectedYear] = useState(null);

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
  }

  return (
    <Box sx={{ paddingBottom: 3 }}>
      <ComparisonSidebarContext.Provider
        value={{
          years,
          selectedYear,
          handleYearChange,
        }}
      >
        {/* Should modularize the indicators/weight Accordion to add here */}
        <YearsSingleSelectAccordion
          disabled={false} // Depending on some sort of selection
          expanded={true}
          onChange={handleChange("panel1")}
          years={years}
          handleYearChange={handleYearChange}
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
        <Button variant="contained" color="primary" >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default ComparisonSidebar;
