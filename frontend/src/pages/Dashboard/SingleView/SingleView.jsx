import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import Header from "../Components/Misc/Header";
import SingleViewSearchbar from "./SingleSearchbar";
import SingleViewSidebar from "./SingleSidebar";
import SingleViewData from "./SingleDataDisplay";
import OverviewAccordion from "../Components/Accordion/OverviewAccordion";
import { useEffect, useState, useContext, createContext } from "react";
import { PageContext } from "../Dashboard";
import useFrameworkData from "../../../hooks/UseFrameworksData";
import useIndicatorData from "../../../hooks/UseIndicatorData";
import useYearsData from "../../../hooks/UseYearsData";
import ScoreCalculation from "../../../utils/ScoreCalculation";
import {
  appBarStyle,
  mainDisplayBoxStyle,
  drawerStyle,
  overviewStyle,
} from "../../../styles/componentStyle";

export const SingleViewContext = createContext();

function SingleView({ token }) {
  const { view, setView } = useContext(PageContext);
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [yearsList, selectedYears, setSelectedYears] = useYearsData(token);
  const [selectedIndustry, setSelectedIndustry] = useState();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allIndicators, allIndicatorValues, fetchIndicatorValues] =
    useIndicatorData(token, selectedCompany, yearsList);
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
            position='fixed'
            color='inherit'
            elevation={0}
            sx={appBarStyle(true)}
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
          <Box sx={overviewStyle(true)}>
            <OverviewAccordion
              isSingleView={true}
              isDisabled={!selectedCompany}
              overviewExpanded={overviewExpanded}
              setOverviewExpanded={setOverviewExpanded}
              token={token}
            />
            <Box sx={mainDisplayBoxStyle}>
              <Drawer
                sx={drawerStyle(selectedCompany)}
                variant='permanent'
                anchor='left'
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
