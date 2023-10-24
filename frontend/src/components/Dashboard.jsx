import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import React from "react";
import Header from "./Header";
import Searchbar from "./Searchbar";
import Overview from "./Overview";
import SelectionSidebar from "./SelectionSidebar";
import DataDisplay from "./DataDisplay";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ token }) {
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const years = useMemo(() => [2022, 2023], []);
  const yearsString = years.join(",");

  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [frameworksData, setFrameworksData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [selectedYears, setSelectedYears] = useState(years);
  const [indicatorValues, setIndicatorValues] = useState([]);
  const [fixedIndicatorValues, setFixedIndicatorValues] = useState([]);
  const [savedWeights, setSavedWeights] = useState({});

  const [allIndicators, setAllIndicators] = useState([]);
  const [allIndicatorValues, setAllIndicatorValues] = useState([]);
  const [selectedExtraIndicators, setSelectedExtraIndicators] = useState([]);

  const sortedSelectedYears = useMemo(() => {
    return [...selectedYears].sort((a, b) => a - b);
  }, [selectedYears]);

  // fetch function is extracted as a separate function
  // this is called to set: indicatorValues (variable changes with sidebar selection)
  //                     & fixedIndicatorValues (fixed value after company selection)
  const fetchIndicatorValues = useCallback(
    (companyId, indicatorIds, yearsString) => {
      return fetch(`/api/values/${companyId}/${indicatorIds}/${yearsString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .catch((error) =>
          console.error("Error fetching indicator values:", error)
        );
    },
    [token, navigate]
  );

  useEffect(() => {
    // New selection of company wipes data display to blank
    const companyId = selectedCompany ? selectedCompany.company_id : 0;
    if (!companyId) {
      setSelectedFramework(null);
      setFrameworksData(null);
      return;
    }

    fetch(`/api/frameworks/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFrameworksData(data.frameworks);
        // Selection is refreshed
        setSelectedFramework(null);
        const allIndicators = data.frameworks.flatMap((framework) =>
          framework.metrics.flatMap((metric) =>
            metric.indicators.map((indicator) => indicator.indicator_id)
          )
        );
        setSelectedIndicators(allIndicators);
        // Set FIXED Indicator values (doesn't change with sidebar selection)
        // this displays a ESG score in Overview for a company
        fetchIndicatorValues(
          companyId,
          [...new Set(allIndicators)].join(","),
          yearsString
        )
          .then((data) => {
            console.log("set fixed overview");
            setFixedIndicatorValues(data.values);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the framework, metric and indicator information.",
          error
        )
      );
  }, [token, navigate, selectedCompany, yearsString, fetchIndicatorValues]);

  // Set indicatorValues, variable selection of indicator values that changes with sidebar
  useEffect(() => {
    if (selectedIndicators.length) {
      // New selection of company wipes data display to blank
      const companyId = selectedCompany ? selectedCompany.company_id : 0;
      if (!companyId) {
        setSelectedFramework(null);
        return;
      }
      // Convert the selectedIndicators to a set to ensure there are no duplicates
      // This is because frameworks may encompass the same metrics and hence the same indicators
      const indicatorIds = [...new Set(selectedIndicators)].join(",");

      fetchIndicatorValues(companyId, indicatorIds, yearsString)
        .then((data) => {
          setIndicatorValues(data.values);
        })
        .catch((error) => console.error(error));
    }
  }, [
    selectedIndicators,
    token,
    years,
    navigate,
    selectedCompany,
    fetchIndicatorValues,
    yearsString,
  ]);

  // Retrieve the values of all possible indicators for the selected company
  useEffect(() => {
    const companyId = selectedCompany ? selectedCompany.company_id : 0;
    if (!companyId) {
      return;
    }

    // Fetch all the possible indicators
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

        // Fetch the indicator values for all the indicators
        return fetch(
          `/api/values/${companyId}/${indicatorIds}/${yearsString}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      })
      .then((response) => response.json())
      .then((data) => {
        setAllIndicatorValues(data.values);
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the complete indicator information.",
          error
        )
      );
  }, [token, selectedCompany, yearsString]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            background: "linear-gradient(45deg, #003366 30%, #336699 90%)",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
            height: 128,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Header token={token} />
          </Toolbar>
          <Toolbar sx={{ margin: "auto" }}>
            <Searchbar
              token={token}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
            />
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
              maxHeight: "450px",
            }}
          >
            <Overview
              selectedIndustry={selectedIndustry}
              selectedCompany={selectedCompany}
              frameworksData={frameworksData}
              fixedIndicatorValues={fixedIndicatorValues}
            />
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
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <SelectionSidebar
                frameworksData={frameworksData}
                years={years}
                selectedFramework={selectedFramework}
                setSelectedFramework={setSelectedFramework}
                selectedIndicators={selectedIndicators}
                setSelectedIndicators={setSelectedIndicators}
                selectedYears={selectedYears}
                setSelectedYears={setSelectedYears}
                setSavedWeights={setSavedWeights}
                allIndicators={allIndicators}
                selectedExtraIndicators={selectedExtraIndicators}
                setSelectedExtraIndicators={setSelectedExtraIndicators}
              />
            </Drawer>
            <DataDisplay
              selectedCompany={selectedCompany}
              selectedFramework={selectedFramework}
              selectedYears={sortedSelectedYears}
              indicatorValues={indicatorValues}
              savedWeights={savedWeights}
              allIndicatorValues={allIndicatorValues}
              selectedExtraIndicators={selectedExtraIndicators}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
