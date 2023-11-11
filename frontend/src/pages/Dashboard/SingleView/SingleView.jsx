import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Header";
import SingleViewSearchbar from "./SingleSearchbar";
import SingleViewSidebar from "./SingleSidebar";
import SingleViewData from "./SingleData";
import OverviewAccordion from "../Components/Accordion/OverviewAccordion";
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

  // Collapsing the Overview section
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const [yearsList, setYearsList] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [frameworksData, setFrameworksData] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedCustomFramework, setSelectedCustomFramework] = useState(null);
  const [isCustomFrameworksDialogOpen, setIsCustomFrameworksDialogOpen] =
    useState(false);
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

  const [adjustedScore, setAdjustedScore] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [additionalIndicatorsData, setAdditionalIndicatorsData] = useState([]);

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
  }, [token]);

  // Upon initial company selection, fetch:
  // frameworks and all its information  (frameworksData)
  useEffect(() => {
    // New selection of company wipes data display to blank
    const companyId = selectedCompany ? selectedCompany.company_id : 0;
    if (!companyId) {
      setSelectedFramework(null);
      setFrameworksData(null);
      setOverviewExpanded(false);
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

    // open overview accordion
    setOverviewExpanded(true);
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

  // Retrieve the data from the selected framework
  useEffect(() => {
    const validIndicatorIds = selectedFramework
      ? selectedFramework.metrics.flatMap((metric) =>
          metric.indicators.map((indicator) => indicator.indicator_id)
        )
      : [];

    const newFilteredData = indicatorValues.filter((row) =>
      validIndicatorIds.includes(row.indicator_id)
    );

    setFilteredData(newFilteredData);
  }, [selectedFramework, indicatorValues]);

  // Retrieve the data from the selected additional indicators
  useEffect(() => {
    const newAdditionalIndicatorsData = allIndicatorValues.filter((indicator) =>
      selectedAdditionalIndicators.includes(indicator.indicator_id)
    );

    setAdditionalIndicatorsData(newAdditionalIndicatorsData);
  }, [selectedAdditionalIndicators, allIndicatorValues]);

  // Adjusted ESG Score Calculation
  function calculateScore(
    savedWeights,
    filteredData,
    savedAdditionalIndicatorWeights,
    additionalIndicatorsData
  ) {
    let totalWeightSum = 0;
    let frameworkScore = 0;
    let additionalScore = 0;

    // Calculate total weight sum from savedWeights, and add the weights from the additional indicators
    if (savedWeights && savedWeights.metrics) {
      totalWeightSum += savedWeights.metrics.reduce(
        (accumulator, metric) => accumulator + metric.metric_weight,
        0
      );
    }

    Object.values(savedAdditionalIndicatorWeights).forEach((weight) => {
      totalWeightSum += weight;
    });

    // Calculate scores for the default framework
    // For each selected indicator within a metric, the score contribution is its value multiplied by its
    // relative weight within the metric, then multiplied by the metric's weight relative to the total weight sum.
    if (savedWeights && savedWeights.metrics) {
      frameworkScore = savedWeights.metrics.reduce((accumulator, metric) => {
        const filteredIndicatorIds = filteredData.map(
          (data) => data.indicator_id
        );

        const selectedIndicators = metric.indicators.filter((indicator) =>
          filteredIndicatorIds.includes(indicator.indicator_id)
        );

        const totalIndicatorWeight = selectedIndicators.reduce(
          (acc, indicator) => acc + indicator.indicator_weight,
          0
        );

        const metricScore = metric.indicators.reduce((acc, indicator) => {
          const matchingIndicator = filteredData.find(
            (data) =>
              data.indicator_id === indicator.indicator_id &&
              data.year === savedWeights.year
          );

          if (matchingIndicator) {
            const indicatorRelativeWeight =
              indicator.indicator_weight / totalIndicatorWeight;
            const indicatorScore =
              matchingIndicator.value *
              indicatorRelativeWeight *
              (metric.metric_weight / totalWeightSum);

            return acc + indicatorScore;
          }
          return acc;
        }, 0);

        return accumulator + metricScore;
      }, 0);
    }

    // Calculate scores for the additional indicators (note that these are not grouped into metrics)
    // For each, the score contribution is its value multiplied by its relative weight in the total weight sum.
    if (Object.keys(savedAdditionalIndicatorWeights).length > 0) {
      additionalScore = additionalIndicatorsData.reduce((accumulator, data) => {
        if (!savedWeights || savedWeights.year === data.year) {
          const weight =
            savedAdditionalIndicatorWeights[data.indicator_id.toString()] || 0;
          const normalisedWeight = weight / totalWeightSum;
          const indicatorScore = data.value * normalisedWeight;
          return accumulator + indicatorScore;
        }
        return accumulator;
      }, 0);
    }

    return frameworkScore + additionalScore;
  }

  // Invoke the score calculation function upon pressing the 'Update Score' button
  function updateScore(savedWeights, savedAdditionalIndicatorWeights) {
    if (savedWeights || savedAdditionalIndicatorWeights) {
      const score = calculateScore(
        savedWeights,
        filteredData,
        savedAdditionalIndicatorWeights,
        additionalIndicatorsData
      );
      setAdjustedScore(score.toFixed(3));
    }
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SingleViewContext.Provider
          value={{
            view,
            setView,
            frameworksData,
            yearsList,
            filteredData,
            additionalIndicatorsData,
            adjustedScore,
            setAdjustedScore,
            updateScore,
            selectedIndustry,
            setSelectedIndustry,
            selectedCompany,
            setSelectedCompany,
            selectedFramework,
            setSelectedFramework,
            selectedCustomFramework,
            setSelectedCustomFramework,
            isCustomFrameworksDialogOpen,
            selectedIndicators,
            setSelectedIndicators,
            indicatorValues,
            fixedIndicatorValues,
            selectedYears,
            setSelectedYears,
            savedWeights,
            setSavedWeights,
            allIndicators,
            allIndicatorValues,
            selectedAdditionalIndicators,
            setSelectedAdditionalIndicators,
            savedAdditionalIndicatorWeights,
            setSavedAdditionalIndicatorWeights,
          }}
        >
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
              <Header
                token={token}
                isCustomFrameworksDialogOpen={isCustomFrameworksDialogOpen}
                setIsCustomFrameworksDialogOpen={
                  setIsCustomFrameworksDialogOpen
                }
              />
            </Toolbar>
            <Toolbar sx={{ margin: "auto" }}>
              <SingleViewSearchbar token={token} />
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
            <OverviewAccordion
              isSingleView={true}
              isDisabled={!(frameworksData && selectedCompany)}
              overviewExpanded={overviewExpanded}
              setOverviewExpanded={setOverviewExpanded}
            />
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
                <SingleViewSidebar token={token} />
              </Drawer>
              <SingleViewData />
            </Box>
          </Box>
        </SingleViewContext.Provider>
      </Box>
    </>
  );
}

export default SingleView;
