import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Header";
import ComparisonSearchbar from "./ComparisonSearchbar";
import ComparisonSidebar from "./ComparisonSidebar";
import ComparisonDataDisplay from "./ComparisonDataDisplay";
import { useContext, createContext, useState, useEffect } from "react";
import { PageContext } from "../Dashboard";
import ComparisonOverview from "./ComparisonOverview";

export const ComparisonViewContext = createContext();

function ComparisonView({ token }) {
  const { view, setView } = useContext(PageContext);

  const [dataView, setDataView] = useState("table");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);               // user selected single year ; TABLE VIEW
  const [selectedYearRange, setSelectedYearRange] = useState([]); // user selected year range; GRAPH VIEW
  const [yearsList, setYearsList] = useState([]);                 // SET range of years data available for the companies
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [indicatorsList, setIndicatorsList] = useState([]);

  // call fetch on all indicator IDs only once upon load
  useEffect(() => {
    fetch("/api/indicators/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIndicatorsList(data.indicators);
      });
  }, [token]);

  // for every new company selection:
  useEffect(() => {
    // clearing company searchbar clears the sidebar selected
    if (selectedCompanies.length === 0) {
      setSelectedYear([])
      setSelectedIndicators([])
    }
    // Fetch all available years of data
    fetch("/api/values/years", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setYearsList(data.years);
        setSelectedYearRange(data.years);
      })
      .catch((error) => {
        if (error !== "No years found") {
          console.error("There was an error fetching the years.", error);
        }
      });
  }, [token, selectedCompanies])

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            background: "linear-gradient(45deg, #A7D8F0 30%, #89CFF0 90%)",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
            height: 128,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Header token={token} />
          </Toolbar>
          <Toolbar sx={{ margin: "auto" }}>
            <ComparisonViewContext.Provider
              value={{
                selectedCompanies,
                setSelectedCompanies,
                view,
                setView,
              }}
            >
              <ComparisonSearchbar token={token} />
            </ComparisonViewContext.Provider>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "fixed",
            top: "128px",
            width: "100%",
            height: "calc(100vh - 128px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxHeight: "320px",
            }}
          >
            <ComparisonOverview />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              overflowY: "auto",
            }}
          >
            <Drawer
              sx={{
                width: 360,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  position: "static",
                  width: 360,
                  boxSizing: "border-box",
                  overflowY: "auto",
                  maxHeight: "100%",
                  // backgroundColor: frameworksData ? "transparent" : "#f5f5f5",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <ComparisonViewContext.Provider
                value={{
                  selectedCompanies,
                  selectedYear,
                  setSelectedYear,
                  selectedYearRange,
                  setSelectedYearRange,
                  selectedIndicators,
                  setSelectedIndicators,
                  indicatorsList,
                  yearsList,
                  dataView,
                  setDataView
                }}
              >
                <ComparisonSidebar token={token} />
              </ComparisonViewContext.Provider>
            </Drawer>
            <ComparisonViewContext.Provider
              value={{
                dataView,
                selectedCompanies,
                selectedYear,
                selectedYearRange,
                selectedIndicators,
                yearsList
              }}
            >
              <ComparisonDataDisplay token={token} />
            </ComparisonViewContext.Provider>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ComparisonView;
