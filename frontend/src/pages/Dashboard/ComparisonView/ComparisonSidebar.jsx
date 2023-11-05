import { Box, Button } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import YearsSingleSelectAccordion from "../Components/Accordion/YearsSingleSelectAccordion";
import IndicatorsAccordion from "../Components/Accordion/IndicatorsAccordion";
import { ComparisonViewContext } from "./ComparisonView";

export const ComparisonSidebarContext = createContext();

function ComparisonSidebar({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    setSelectedYear,
    selectedIndicators,
    setSelectedIndicators,
  } = useContext(ComparisonViewContext);

  const [yearsList, setYearsList] = useState([]);
  const [indicatorsList, setIndicatorsList] = useState([]);

  useEffect(() => {
    console.log(selectedCompanies);
    // Fetch all available years
    fetch("/api/values/years", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setYearsList(data.years);
      })
      .catch((error) => {
        if (error !== "No years found") {
          console.error("There was an error fetching the years.", error);
        }
      });

    // Fetch all available indicators
    fetch("/api/indicators/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIndicatorsList(data.indicators);
      });
  }, [token, selectedCompanies]);

  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
  });

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(yearsList.find((y) => y === parseInt(year)));
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
          yearsList,
          setYearsList,
          selectedYear,
          handleYearChange,
          indicatorsList,
          selectedIndicators,
          handleIndicatorsChange,
        }}
      >
        <YearsSingleSelectAccordion
          disabled={selectedCompanies.length === 0} // Depending on some sort of selection
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
          years={yearsList}
          handleYearChange={handleYearChange}
        />
        <IndicatorsAccordion
          disabled={selectedCompanies.length === 0}
          expanded={expanded.panel2}
          onChange={handleChange("panel2")}
        />
      </ComparisonSidebarContext.Provider>
      {/* {selectedYear && (
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
      )} */}
    </Box>
  );
}

export default ComparisonSidebar;
