import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Header";
import SingleViewSearchbar from "./SingleSearchbar";
import SingleViewOverview from "./SingleOverview";
import SingleViewSidebar from "./SingleSidebar";
import SingleViewData from "./SingleData";
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { PageContext } from "../Dashboard";

export const SingleViewContext = createContext();

function SingleView({ token }) {
  const { view, setView } = useContext(PageContext);
  const navigate = useNavigate();

  const [yearsList, setYearsList] = useState([]);

  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [frameworksData, setFrameworksData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedCustomFramework, setSelectedCustomFramework] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [indicatorValues, setIndicatorValues] = useState([]);
  const [fixedIndicatorValues, setFixedIndicatorValues] = useState([]);
  const [savedWeights, setSavedWeights] = useState({});
  const [savedAdditionalIndicatorWeights, setSavedAdditionalIndicatorWeights] =
    useState({});

  const [allIndicators, setAllIndicators] = useState([]);
  const [allIndicatorValues, setAllIndicatorValues] = useState([]);
  const [selectedAdditionalIndicators, setSelectedAdditionalIndicators] =
    useState([]);

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
        .then((response) => response.json())
        .catch((error) =>
          console.error("Error fetching indicator values:", error)
        );
    },
    [token]
  );

  useEffect(() => {
    // Fetch all available years of data
    fetch("/api/values/years", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setYearsList(data.years);
        setSelectedYears(data.years);
      })
      .catch((error) => {
        if (error !== "No years found") {
          console.error("There was an error fetching the years.", error);
        }
      });
  },[token]);

  // Upon initial company selection, fetch:
  // frameworks and all its information  (frameworksData)
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
      .then((response) => response.json())
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
        // this displays a ESG score in SingleViewOverview for a company
        fetchIndicatorValues(
          companyId,
          [...new Set(allIndicators)].join(","),
          yearsList.join(",")
        )
          .then((data) => {
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
  }, [token, navigate, selectedCompany, yearsList, fetchIndicatorValues]);

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
      const yearsString = yearsList.join(",");

      fetchIndicatorValues(companyId, indicatorIds, yearsString)
        .then((data) => {
          setIndicatorValues(data.values);
        })
        .catch((error) => console.error(error));
    }
  }, [
    selectedIndicators,
    token,
    selectedCompany,
    fetchIndicatorValues,
    yearsList,
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
          `/api/values/${companyId}/${indicatorIds}/${yearsList.join(",")}`,
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
  }, [token, selectedCompany, yearsList]);

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
            <SingleViewContext.Provider
              value={{
                selectedIndustry,
                setSelectedIndustry,
                selectedCompany,
                setSelectedCompany,
                view,
                setView,
              }}
            >
              <SingleViewSearchbar token={token} />
            </SingleViewContext.Provider>
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
            <SingleViewContext.Provider
              value={{
                selectedCompany,
                frameworksData,
                fixedIndicatorValues,
              }}
            >
              <SingleViewOverview />
            </SingleViewContext.Provider>
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
                  backgroundColor: frameworksData ? "transparent" : "#f5f5f5",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <SingleViewContext.Provider
                value={{
                  selectedCompany,
                  frameworksData,
                  yearsList,
                  selectedFramework,
                  setSelectedFramework,
                  selectedCustomFramework,
                  setSelectedCustomFramework,
                  selectedIndicators,
                  setSelectedIndicators,
                  selectedYears,
                  setSelectedYears,
                  setSavedWeights,
                  allIndicators,
                  selectedAdditionalIndicators,
                  setSelectedAdditionalIndicators,
                  setSavedAdditionalIndicatorWeights,
                }}
              >
                <SingleViewSidebar token={token} />
              </SingleViewContext.Provider>
            </Drawer>
            <SingleViewContext.Provider
              value={{
                selectedCompany,
                selectedFramework,
                selectedYears,
                setSelectedYears,
                indicatorValues,
                savedWeights,
                allIndicators,
                allIndicatorValues,
                selectedAdditionalIndicators,
                savedAdditionalIndicatorWeights,
              }}
            >
              <SingleViewData />
            </SingleViewContext.Provider>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SingleView;
