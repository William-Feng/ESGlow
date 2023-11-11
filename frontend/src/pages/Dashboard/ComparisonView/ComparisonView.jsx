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
  const [portfolioRating, setPortfolioRating] = useState(0);
  const [bestPerformer, setBestPerformer] = useState(0);
  const [worstPerformer, setWorstPerformer] = useState(0);
  const [dataView, setDataView] = useState("table");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]); // user selected single year ; TABLE VIEW
  const [selectedYearRange, setSelectedYearRange] = useState([]); // user selected year range; GRAPH VIEW
  const [yearsList, setYearsList] = useState([]); // SET range of years data available for the companies
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

  // For every new company selection:
  useEffect(() => {
    // Fetch portfolio overview values
    const fetchPromises = selectedCompanies.map((company) =>
      fetch(`/api/values/company/${company.company_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => data[company.company_id].value.ESGscore)
    );
    Promise.all(fetchPromises)
      .then((esgScores) => {
        if (esgScores.length === 0) {
          // No scores available
          setPortfolioRating();
          setBestPerformer();
          setWorstPerformer();
        } else {
          // Calculate average ESG score
          const totalScore = esgScores.reduce((sum, score) => sum + score, 0);
          const averageScore = totalScore / esgScores.length;
          setPortfolioRating(averageScore.toFixed(1));
          // Find best and worst performers
          setBestPerformer(Math.max(...esgScores));
          setWorstPerformer(Math.min(...esgScores));
        }
      })
      .catch((error) =>
        console.error("There was an error fetching the ESG scores.", error)
      );

    // Clearing company searchbar clears the sidebar selected
    if (selectedCompanies.length === 0) {
      setSelectedYear([]);
      setSelectedIndicators([]);
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
  }, [token, selectedCompanies]);

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
            <ComparisonViewContext.Provider
              value={{
                selectedCompanies,
                portfolioRating,
                bestPerformer,
                worstPerformer,
              }}
            >
              <ComparisonOverview />
            </ComparisonViewContext.Provider>
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
                  setDataView,
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
                yearsList,
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
