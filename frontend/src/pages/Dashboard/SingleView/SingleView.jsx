import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Components/Misc/Header";
import SingleViewSearchbar from "./SingleSearchbar";
import SingleViewSidebar from "./SingleSidebar";
import SingleViewData from "./SingleData";
import OverviewAccordion from "../Components/Accordion/OverviewAccordion";
import { useEffect, useState, useContext, createContext } from "react";
import { PageContext } from "../Dashboard";
import useFrameworkData from "../../../hooks/UseFrameworksData";
import UseIndicatorData from "../../../hooks/UseIndicatorData";
import useIndicatorValuesData from "../../../hooks/UseIndicatorValuesData";
import useYearsData from "../../../hooks/UseYearsData";
import ScoreCalculation from "../../../utils/ScoreCalculation";

export const SingleViewContext = createContext();

function SingleView({ token }) {
  const { view, setView } = useContext(PageContext);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [yearsList, selectedYears, setSelectedYears] = useYearsData(token);
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const fetchIndicatorValues = useIndicatorValuesData(token);
  const {
    frameworksData,
    selectedFramework,
    setSelectedFramework,
    selectedIndicators,
    setSelectedIndicators,
    fixedIndicatorValues,
  } = useFrameworkData(
    token,
    selectedCompany,
    yearsList,
    fetchIndicatorValues,
    setOverviewExpanded
  );
  const [selectedCustomFramework, setSelectedCustomFramework] = useState(null);
  const [isCustomFrameworksDialogOpen, setIsCustomFrameworksDialogOpen] =
    useState(false);
  const [indicatorValues, setIndicatorValues] = useState([]);
  const [savedWeights, setSavedWeights] = useState({});
  const [savedAdditionalIndicatorWeights, setSavedAdditionalIndicatorWeights] =
    useState({});
  const [allIndicators, allIndicatorValues] = UseIndicatorData(
    token,
    selectedCompany,
    yearsList
  );
  const [selectedAdditionalIndicators, setSelectedAdditionalIndicators] =
    useState([]);

  const [adjustedScore, setAdjustedScore] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [additionalIndicatorsData, setAdditionalIndicatorsData] = useState([]);

  // Set the variable indicator values that changes with sidebar selections
  useEffect(() => {
    if (selectedIndicators.length) {
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
    token,
    setSelectedFramework,
    selectedCompany,
    selectedIndicators,
    yearsList,
    fetchIndicatorValues,
  ]);

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

  // Invoke the Adjusted ESG Score Calculation function upon pressing the 'Update Score' button
  function updateScore(savedWeights, savedAdditionalIndicatorWeights) {
    if (savedWeights || savedAdditionalIndicatorWeights) {
      const score = ScoreCalculation(
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
              isDisabled={!selectedCompany}
              overviewExpanded={overviewExpanded}
              setOverviewExpanded={setOverviewExpanded}
              token={token}
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
                    backgroundColor: selectedCompany
                      ? "transparent"
                      : "#f5f5f5",
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
