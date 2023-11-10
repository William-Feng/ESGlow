import { Box } from "@mui/material";
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
    indicatorsList,
  } = useContext(ComparisonViewContext);

  const [yearsList, setYearsList] = useState([]);

  useEffect(() => {
    // close accordions upon clearing companies selection
    if (selectedCompanies.length === 0) {
      setExpanded({
        panel1: false,
        panel2: false,
      });
      return;
    }
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
          disabled={selectedCompanies.length === 0} // Disable on no selected companies
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
    </Box>
  );
}

export default ComparisonSidebar;
