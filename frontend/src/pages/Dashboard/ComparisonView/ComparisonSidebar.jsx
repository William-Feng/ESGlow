import { Box, Button } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import YearsSingleSelectAccordion from "./YearsSingleSelectAccordion";
import IndicatorsAccordion from "./IndicatorsAccordion";
import { ComparisonViewContext } from "./ComparisonView";

export const ComparisonSidebarContext = createContext();

function ComparisonSidebar({ token }) {
  const {
    selectedCompanies,
    selectedYear,
    setSelectedYear,
    allIndicators,
    setAllIndicators,
    selectedIndicators,
    setSelectedIndicators,
  } = useContext(ComparisonViewContext);

  const [yearsList, setYearsList] = useState([]);

  useEffect(() => {
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
  }, [selectedCompanies]);

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(yearsList.find((y) => y === parseInt(year)));
  };

  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
  });

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  useEffect(() => {
    fetch("/api/indicators/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAllIndicators(data.indicators);
        const indicatorIds = data.indicators
          .map((d) => d.indicator_id)
          .join(",");
        // Fetch indicator weights
      });
  }, [token, selectedCompanies, selectedYear]);

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
          allIndicators,
          selectedIndicators,
          handleIndicatorsChange,
        }}
      >
        <YearsSingleSelectAccordion
          disabled={false} // Depending on some sort of selection
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
          years={yearsList}
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
