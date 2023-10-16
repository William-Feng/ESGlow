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
import { useEffect, useMemo, useState } from "react";

function Dashboard({ token }) {
  const defaultTheme = createTheme();

  const years = useMemo(() => [2022, 2023], []);

  const [frameworksData, setFrameworksData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [selectedYears, setSelectedYears] = useState(years);
  const [indicatorValues, setIndicatorValues] = useState([]);

  const sortedSelectedYears = useMemo(() => {
    return [...selectedYears].sort((a, b) => a - b);
  }, [selectedYears]);

  useEffect(() => {
    // This will be hard coded until the company selection is implemented
    const companyId = 1;

    fetch(`/api/frameworks/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFrameworksData(data);
        const allIndicators = data.flatMap((framework) =>
          framework.metrics.flatMap((metric) =>
            metric.indicators.map((indicator) => indicator.indicator_id)
          )
        );
        setSelectedIndicators(allIndicators);
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the framework, metric and indicator information!",
          error
        )
      );
  }, [token]);

  // Fetch indicator values whenever selected indicators change
  useEffect(() => {
    if (selectedIndicators.length) {
      // This is hard coded for now
      const companyId = 1;
      // Convert the selectedIndicators to a set to ensure there are no duplicates
      // This is because frameworks may encompass the same metrics and hence the same indicators
      const indicatorIds = [...new Set(selectedIndicators)].join(",");
      const yearsString = years.join(",");

      fetch(`/api/values/${companyId}/${indicatorIds}/${yearsString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setIndicatorValues(data))
        .catch((error) =>
          console.error("Error fetching indicator values:", error)
        );
    }
  }, [selectedIndicators, token, years]);

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
            bgcolor: "primary.main",
            height: 128,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Header />
          </Toolbar>
          <Toolbar sx={{ margin: "auto" }}>
            <Searchbar />
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
              border: "dotted",
              margin: "0",
              textAlign: "center",
              maxHeight: "450px",
            }}
          >
            <Overview />
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
                setSelectedIndicators={setSelectedIndicators}
                setSelectedYears={setSelectedYears}
              />
            </Drawer>
            <DataDisplay
              selectedFramework={selectedFramework}
              selectedYears={sortedSelectedYears}
              indicatorValues={indicatorValues}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
