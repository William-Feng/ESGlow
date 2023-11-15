import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Components/Misc/Header";
import ComparisonSearchbar from "./ComparisonSearchbar";
import ComparisonSidebar from "./ComparisonSidebar";
import ComparisonDataDisplay from "./ComparisonDataDisplay";
import { useContext, createContext, useState, useEffect } from "react";
import { PageContext } from "../Dashboard";
import OverviewAccordion from "../Components/Accordion/OverviewAccordion";
import useIndicatorData from "../../../hooks/UseIndicatorData";
import useYearsData from "../../../hooks/UseYearsData";
import {
  appBarStyle,
  mainDisplayBoxStyle,
  drawerStyle,
  overviewStyle,
} from "../../../styles/componentStyle";

export const ComparisonModeContext = createContext();

function ComparisonMode({ token }) {
  const { mode, setMode } = useContext(PageContext);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [dataView, setDataView] = useState("table");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  // User selected single year in table view
  const [selectedYear, setSelectedYear] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  // List of years available for selection, user selected year range in graph view
  const [yearsList, selectedYearRange, setSelectedYearRange] =
    useYearsData(token);
  const [indicatorsList] = useIndicatorData(
    token,
    selectedCompanies.length > 0 ? selectedCompanies[0] : null,
    selectedYearRange
  );

  useEffect(() => {
    // Clearing company searchbar clears the sidebar selections
    if (selectedCompanies.length === 0) {
      setSelectedYear([]);
      setSelectedIndicators([]);
      setOverviewExpanded(false);
      return;
    }
    // Open overview accordion
    setOverviewExpanded(true);
  }, [token, selectedCompanies]);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <ComparisonModeContext.Provider
          value={{
            selectedCompanies,
            setSelectedCompanies,
            mode,
            setMode,
            selectedYear,
            setSelectedYear,
            selectedYearRange,
            setSelectedYearRange,
            selectedIndicators,
            setSelectedIndicators,
            indicatorsList,
            yearsList,
            dataView,
            setDataView,
          }}
        >
          <CssBaseline />
          <AppBar
            enableColorOnDark
            color="inherit"
            elevation={0}
            sx={appBarStyle(false)}
          >
            <Toolbar>
              <Header token={token} />
            </Toolbar>
            <Toolbar sx={{ margin: "auto" }}>
              <ComparisonSearchbar token={token} />
            </Toolbar>
          </AppBar>
          <Box sx={overviewStyle(false)}>
            <OverviewAccordion
              isSingleMode={false}
              isDisabled={!selectedCompanies.length}
              overviewExpanded={overviewExpanded}
              setOverviewExpanded={setOverviewExpanded}
              token={token}
            />
            <Box sx={mainDisplayBoxStyle}>
              <Drawer
                sx={drawerStyle(selectedCompanies.length)}
                variant="permanent"
                anchor="left"
              >
                <ComparisonSidebar token={token} />
              </Drawer>
              <ComparisonDataDisplay token={token} />
            </Box>
          </Box>
        </ComparisonModeContext.Provider>
      </Box>
    </>
  );
}

export default ComparisonMode;
