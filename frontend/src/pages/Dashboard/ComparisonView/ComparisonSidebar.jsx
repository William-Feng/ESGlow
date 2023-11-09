import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import YearsSingleAccordion from "../Components/Accordion/YearsSingleAccordion";
import YearsRangeAccordion from "../Components/Accordion/YearsRangeAccordion";
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
    dataView,
    yearsList,
    setDataView
  } = useContext(ComparisonViewContext);

  // useEffect(() => {
  //   if (dataView === 'graph') {
  //     setSelectedYear([Math.min(...yearsList), Math.max(...yearsList)])
  //   }
  // }, [dataView])

  useEffect(() => {
    // close accordions upon clearing companies selection
    if (selectedCompanies.length === 0) {
      setExpanded({
        panel1: false,
        panel2: false
      })
      return
    }
  }, [token, selectedCompanies]);

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
          yearsList,
          setSelectedYear,
          selectedYear,
          indicatorsList,
          selectedIndicators,
          handleIndicatorsChange,
        }}
      >
        <ToggleButtonGroup
          value={dataView}
          exclusive
          onChange={(e) => setDataView(e.currentTarget.value)}
          aria-label="table view"
          sx={{
            backgroundColor: "#E8E8E8",
          }}
        >
          <ToggleButton
            value="table"
            sx={{
              backgroundColor: dataView === "table" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography
              variant="body4"
              textAlign="center"
            >
              Table View
            </Typography>
          </ToggleButton>
          <ToggleButton
            value="graph"
            sx={{
              backgroundColor: dataView === "graph" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography
              variant="body4"
              textAlign="center"
            >
              Graph View
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        { dataView === 'graph' ? (
          <YearsRangeAccordion
            disabled={selectedCompanies.length === 0} // Depending on some sort of selection
            expanded={expanded.panel1}
            onChange={handleChange("panel1")}
          />
        ) : (
          <YearsSingleAccordion
            disabled={selectedCompanies.length === 0} // Depending on some sort of selection
            expanded={expanded.panel1}
            onChange={handleChange("panel1")}
          />
        )}
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
