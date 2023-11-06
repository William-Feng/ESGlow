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

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [indicatorsList, setIndicatorsList] = useState([]);       // TODO: send it to sidebar
  const [companyAllIndicatorValues, setCompanyAllIndicatorValues] = useState({});

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
  }, [])

  // useEffect(() => {
  //   // prepare the indicatorIds list
  //   if ((selectedYear && selectedCompanies) && indicatorsList.length > 0) {
  //     const indicatorIds = indicatorsList.join(",");
  //     const newData = {}; // Create a copy of the currentData object

  //     selectedCompanies.forEach((c) => {
  //       fetch(`/api/values/${c.company_id}/${indicatorIds}/${selectedYear}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           const dataValues = data.values
  //           // Assume that data is an object with indicator IDs as keys and scores
  //           // Update newData with the fetched data
  //           dataValues.forEach((indicatorInfo) => {
  //             if (!newData[indicatorInfo.indicator_id]) {
  //               newData[indicatorInfo.indicator_id] = {
  //                 name: indicatorInfo.indicator_name,
  //               };
  //             }
  //             newData[indicatorInfo.indicator_id][c.company_id] = indicatorInfo.value;
  //           });
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching indicator values for company:", error);
  //         });
  //     });
  //   }

  // }, [token, selectedCompanies, selectedYear, indicatorsList]);

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
                  selectedIndicators,
                  setSelectedIndicators,
                  indicatorsList
                }}
              >
                <ComparisonSidebar token={token} />
              </ComparisonViewContext.Provider>
            </Drawer>
            <ComparisonViewContext.Provider
              value={{
                selectedCompanies,
                selectedYear,
                selectedIndicators,
              }}
            >
              <ComparisonDataDisplay token={token}/>
            </ComparisonViewContext.Provider>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ComparisonView;
