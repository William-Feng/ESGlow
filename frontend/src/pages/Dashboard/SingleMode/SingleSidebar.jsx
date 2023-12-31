import { createContext, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { SingleModeContext } from "./SingleMode";
import SnackbarManager from "../Components/Misc/SnackbarManager";
import FrameworkAccordion from "../Components/Accordion/FrameworkAccordion";
import MetricsIndicatorsAccordion from "../Components/Accordion/MetricsIndicatorsAccordion";
import MultiSelectAccordion from "../Components/Accordion/MultiSelectAccordion";
import AdditionalIndicatorsAccordion from "../Components/Accordion/AdditionalIndicatorsAccordion";
import SidebarSaveButtons from "../Components/Misc/SidebarSaveButtons";
import useCustomFrameworksData from "../../../hooks/UseCustomFrameworksData";
import { sidebarBoxStyle } from "../../../styles/ComponentStyle";
import ToggleDataView from "../Components/Misc/ToggleDataView";

export const SidebarContext = createContext();

/*
  selectedFramework: Nested Object that contains all metric and indicator information
    -> this information does NOT CHANGE with user selection; retrieved from database
  selectedIndicators: Array that contains the selected indicators by ID
    -> selectedIndicators array CHANGES with user selection from the sidebar
*/
function SingleSidebar({ token }) {
  const {
    selectedCompany,
    frameworksData,
    yearsList,
    selectedFramework,
    setSelectedFramework,
    selectedCustomFramework,
    setSelectedCustomFramework,
    isCustomFrameworksDialogOpen,
    selectedIndicators,
    setSelectedIndicators,
    selectedYears,
    setSelectedYears,
    setSavedWeights,
    allIndicators,
    selectedAdditionalIndicators,
    setSelectedAdditionalIndicators,
    setSavedAdditionalIndicatorWeights,
    updateScore,
    setAdjustedScore,
    setDataView,
    dataView,
  } = useContext(SingleModeContext);

  // Reset the states if the company is changed or deleted
  // Note that selected additional indicators remain the same if a new framework is selected
  useEffect(() => {
    setSelectedFramework(null);
    setSelectedCustomFramework(null);
    setSelectedIndicators([]);
    setSelectedAdditionalIndicators([]);
    // Set the weights to 0
    const weights = {};
    allIndicators.forEach((indicator) => {
      weights[indicator.indicator_id] = 0;
    });
    setAdditionalIndicatorWeights(weights);
    setAdjustedScore(0);
  }, [
    selectedCompany,
    setSelectedFramework,
    setSelectedCustomFramework,
    setSelectedIndicators,
    setSelectedAdditionalIndicators,
    allIndicators,
    setAdjustedScore,
  ]);

  const frameworkMetrics = selectedFramework ? selectedFramework.metrics : [];

  const handleFrameworkChange = (event) => {
    const frameworkValue = event.target.value;
    const [type, frameworkIdString] = frameworkValue.split("-");
    const frameworkId = parseInt(frameworkIdString, 10);

    if (type === "custom") {
      setSelectedCustomFramework(
        customFrameworks.find((f) => f.framework_id === frameworkId)
      );
      setSelectedFramework(null);
    } else {
      const newFramework = frameworksData.find(
        (f) => f.framework_id === frameworkId
      );
      setSelectedFramework(newFramework);
      setSelectedCustomFramework(null);

      // Reset indicator weights to the predefined weights and update the selected indicators
      const newIndicatorWeights = {};
      newFramework.metrics.forEach((metric) => {
        metric.indicators.forEach((indicator) => {
          newIndicatorWeights[indicator.indicator_id] =
            indicator.predefined_weight;
        });
      });
      setIndicatorWeights(newIndicatorWeights);
      setSelectedIndicators(
        frameworksData.flatMap((framework) =>
          framework.metrics.flatMap((metric) =>
            metric.indicators.map((indicator) => indicator.indicator_id)
          )
        )
      );
    }
  };

  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricWeights, setMetricWeights] = useState({});
  const [indicatorWeights, setIndicatorWeights] = useState({});

  useEffect(() => {
    if (selectedFramework) {
      const selectedMetrics = selectedFramework.metrics;
      setSelectedMetrics(selectedMetrics);

      // Populate the metric and indicator weights with predefined weights
      const initialMetricWeights = {};
      const initialIndicatorWeights = {};
      selectedMetrics.forEach((metric) => {
        initialMetricWeights[metric.metric_id] = metric.predefined_weight;
        metric.indicators.forEach((indicator) => {
          initialIndicatorWeights[indicator.indicator_id] =
            indicator.predefined_weight;
        });
      });
      setMetricWeights(initialMetricWeights);
      setIndicatorWeights(initialIndicatorWeights);
    } else {
      setSelectedMetrics([]);
      setMetricWeights({});
      setIndicatorWeights({});
    }
  }, [selectedFramework]);

  const [expanded, setExpanded] = useState({
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false,
  });

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  // Collapse all accordions when the company is changed or deleted
  useEffect(() => {
    if (!selectedCompany) {
      setExpanded({
        panel1: false,
        panel2: false,
        panel3: false,
        panel4: false,
      });
    }
  }, [selectedCompany]);

  const [expandedMetrics, setExpandedMetrics] = useState([]);

  const toggleMetric = (metricId) => {
    if (expandedMetrics.includes(metricId)) {
      setExpandedMetrics((prev) => prev.filter((id) => id !== metricId));
    } else {
      setExpandedMetrics((prev) => [...prev, metricId]);
    }
  };

  const isMetricExpanded = (metricId) => {
    return expandedMetrics.includes(metricId);
  };

  const handleIndicatorChange = (metric, indicatorId, checked) => {
    // Update the new selected indicators
    const newSelectedIndicators = checked
      ? [...selectedIndicators, indicatorId]
      : selectedIndicators.filter((id) => id !== indicatorId);

    setSelectedIndicators(newSelectedIndicators);

    // Update selected metrics
    setSelectedMetrics((prevMetrics) => {
      const metricAlreadySelected = prevMetrics.some(
        (m) => m.metric_id === metric.metric_id
      );

      if (checked && !metricAlreadySelected) {
        // If an indicator is being selected and its metric is not already selected, add the metric
        return [...prevMetrics, metric];
      } else if (!checked && metricAlreadySelected) {
        // If an indicator is being deselected, check if the metric still has any selected indicators
        const isAnyIndicatorInMetricSelected = metric.indicators.some((ind) =>
          newSelectedIndicators.includes(ind.indicator_id)
        );
        if (!isAnyIndicatorInMetricSelected) {
          // If no indicators in the metric are selected, remove the metric
          return prevMetrics.filter((m) => m.metric_id !== metric.metric_id);
        }
      }
      return prevMetrics;
    });
  };

  const handleMetricChange = (metric, event) => {
    const checked = event.target.checked;

    setSelectedMetrics((prevMetrics) => {
      if (!checked) {
        return prevMetrics.filter((m) => m !== metric);
      } else if (checked && !prevMetrics.includes(metric)) {
        return [...prevMetrics, metric];
      } else {
        return [...prevMetrics];
      }
    });

    const indicators = metric.indicators;
    setSelectedIndicators((prevIndicators) => {
      const updatedIndicators = prevIndicators.filter(
        (id) => !indicators.some((indicator) => indicator.indicator_id === id)
      );

      return checked
        ? [
            ...updatedIndicators,
            ...indicators.map((indicator) => indicator.indicator_id),
          ]
        : updatedIndicators;
    });
  };

  function howManyIndicatorsChecked(metric) {
    const indicatorList = metric.indicators.map(
      (indicator) => indicator.indicator_id
    );
    // Check how many of the IDs in indicatorList is in selectedIndicators
    const checkedIndicators = indicatorList.filter((indicatorId) =>
      selectedIndicators.includes(indicatorId)
    );
    // Return the count of checked indicators
    return checkedIndicators.length;
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState("");
  const [newWeightMetridId, setNewWeightMetridId] = useState("");
  const [newWeightIndicatorId, setNewWeightIndicatorId] = useState("");
  const [newWeightAdditionalIndicatorId, setNewWeightAdditionalIndicatorId] =
    useState("");

  const determineChipColor = (metric, indicator) => {
    if (metric) {
      const metricId = metric.metric_id;
      if (!selectedMetrics.find((m) => m.metric_id === metricId)) {
        // Return red if no indicators within the metric are selected
        return "error";
      } else if (
        Math.abs(
          metricWeights[metricId] - parseFloat(metric.predefined_weight)
        ) <= 0.0001
      ) {
        // Return green if weight has not been edited
        return "success";
      } else {
        // Return orange if weight has been edited
        return "warning";
      }
    } else if (indicator) {
      const indicatorId = indicator.indicator_id;
      if (!selectedIndicators.includes(indicatorId)) {
        return "error";
      } else if (
        Math.abs(
          indicatorWeights[indicatorId] -
            parseFloat(indicator.predefined_weight)
        ) <= 0.0001
      ) {
        return "success";
      } else {
        return "warning";
      }
    }
  };

  const openWeightDialog = (metricId, indicatorId, isAdditionalIndicator) => {
    setIsDialogOpen(true);
    if (isAdditionalIndicator) {
      setNewWeightAdditionalIndicatorId(indicatorId);
    } else {
      setNewWeightMetridId(metricId);
      setNewWeightIndicatorId(indicatorId);
    }
  };

  const closeWeightDialog = () => {
    setNewWeightInput("");
    setIsDialogOpen(false);
  };

  const handleNewWeightChange = (e) => {
    setNewWeightInput(e.target.value);
  };

  const handleWeightChange = (
    e,
    metricId,
    indicatorId,
    isAdditionalIndicator
  ) => {
    e.stopPropagation();
    openWeightDialog(metricId, indicatorId, isAdditionalIndicator);
  };

  const handleWeightSave = () => {
    if (!isNaN(newWeightInput)) {
      if (newWeightMetridId) {
        setMetricWeights((prevMetrics) => ({
          ...prevMetrics,
          [newWeightMetridId]: parseFloat(
            parseFloat(newWeightInput).toFixed(3)
          ),
        }));
      } else if (newWeightIndicatorId) {
        setIndicatorWeights((prevWeights) => ({
          ...prevWeights,
          [newWeightIndicatorId]: parseFloat(
            parseFloat(newWeightInput).toFixed(3)
          ),
        }));
      } else if (newWeightAdditionalIndicatorId) {
        setAdditionalIndicatorWeights((prevWeights) => ({
          ...prevWeights,
          [newWeightAdditionalIndicatorId]: parseFloat(
            parseFloat(newWeightInput).toFixed(3)
          ),
        }));
      }
      closeWeightDialog();
    }
  };

  const handleYearChange = (year) => {
    setSelectedYears((prevYears) => {
      if (prevYears.includes(year)) {
        const newYearsList = prevYears.filter((y) => y !== year);
        return newYearsList.sort((a, b) => a - b);
      } else {
        const newYearsList = [...prevYears, year];
        return newYearsList.sort((a, b) => a - b);
      }
    });
  };

  const [additionalIndicators, setAdditionalIndicators] = useState([]);
  const [additionalIndicatorWeights, setAdditionalIndicatorWeights] = useState(
    []
  );

  // Discover the indicators that should be displayed in the Additional Indicators accordion
  useEffect(() => {
    if (selectedCustomFramework) {
      // All indicators should be displayed if a custom framework is selected
      setAdditionalIndicators(allIndicators);

      // Set the predefined weights for the indicators within the custom framework
      // Otherwise, the weights will be set to 0
      const indicatorWeights = {};
      allIndicators.forEach((indicator) => {
        indicatorWeights[indicator.indicator_id] = 0;
      });

      selectedCustomFramework.preferences.forEach((preference) => {
        indicatorWeights[preference.indicator_id] = preference.weight;
      });
      setAdditionalIndicatorWeights(indicatorWeights);
      setSelectedAdditionalIndicators(
        selectedCustomFramework.preferences.map(
          (preference) => preference.indicator_id
        )
      );
    } else {
      // If a default framework is selected, only display the indicators that are not in the framework
      // Otherwise, display all indicators
      const frameworkIndicatorIds = selectedFramework
        ? selectedFramework.metrics
            .reduce((acc, metric) => acc.concat(metric.indicators), [])
            .map((indicator) => indicator.indicator_id)
        : [];

      const filtered_indicators = allIndicators.filter(
        (indicator) => !frameworkIndicatorIds.includes(indicator.indicator_id)
      );
      setAdditionalIndicators(filtered_indicators);

      // Set the weights to 0
      const filteredIndicatorWeights = {};
      filtered_indicators.forEach((indicator) => {
        filteredIndicatorWeights[indicator.indicator_id] = 0;
      });
      setAdditionalIndicatorWeights(filteredIndicatorWeights);
      setSelectedAdditionalIndicators([]);
    }
  }, [
    allIndicators,
    selectedFramework,
    selectedCustomFramework,
    setSelectedAdditionalIndicators,
  ]);

  const handleAdditionalIndicatorsChange = (indicatorId) => {
    setSelectedAdditionalIndicators((prev) => {
      const isIndicatorSelected = prev.includes(indicatorId);

      setAdditionalIndicatorWeights((prevWeights) => {
        // Update the weight if the indicator is being selected, and it's currently set to 0
        // Otherwise, if it's being deselected or already has a non-zero weight, leave it unchanged
        const currentWeight = prevWeights[indicatorId];
        const newWeight = isIndicatorSelected
          ? 0
          : currentWeight === 0
          ? 0.5
          : currentWeight;

        return {
          ...prevWeights,
          [indicatorId]: newWeight,
        };
      });

      // If the indicator is already selected, remove it from the selection
      // If not, add the indicator to the selection
      return isIndicatorSelected
        ? prev.filter((id) => id !== indicatorId)
        : [...prev, indicatorId];
    });
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateSelections = () => {
    if (selectedYears.length === 0) {
      return setErrorMessage("Please select at least one year.");
    }

    // Prepare the metrics and their weights for saving
    const newSavedWeights = {
      metrics: selectedMetrics.map((metric) => ({
        metric_id: metric.metric_id,
        metric_weight: metricWeights[metric.metric_id],
        indicators: metric.indicators
          .filter((indicator) =>
            selectedIndicators.includes(indicator.indicator_id)
          )
          .map((indicator) => ({
            indicator_id: indicator.indicator_id,
            indicator_weight: indicatorWeights[indicator.indicator_id],
          })),
      })),
      year: Math.max(...selectedYears),
    };
    setSavedWeights(newSavedWeights);

    // Include the weights from the additional indicators
    const newSavedAdditionalWeights = {};
    selectedAdditionalIndicators.forEach((indicatorId) => {
      newSavedAdditionalWeights[indicatorId] =
        additionalIndicatorWeights[indicatorId];
    });
    setSavedAdditionalIndicatorWeights(newSavedAdditionalWeights);

    updateScore(newSavedWeights, newSavedAdditionalWeights);

    return setSuccessMessage("Selections updated successfully.");
  };

  // Update the user's custom frameworks on successful save or when the user manages/deletes them
  const [saveTrigger, setSaveTrigger] = useState(false);
  const { customFrameworks } = useCustomFrameworksData(
    token,
    isCustomFrameworksDialogOpen,
    saveTrigger
  );

  // To save the user's custom framework
  const [saveFrameworkDialogOpen, setSaveFrameworkDialogOpen] = useState(false);
  const [customFrameworkName, setCustomFrameworkName] = useState("");
  const [customFrameworkDescription, setCustomFrameworkDescription] =
    useState("");

  const handleSaveFrameworkDialogToggle = () => {
    setSaveFrameworkDialogOpen(!saveFrameworkDialogOpen);
  };

  const handleCustomFrameworkNameChange = (event) => {
    setCustomFrameworkName(event.target.value);
  };

  const handleCustomFrameworkDescriptionChange = (event) => {
    setCustomFrameworkDescription(event.target.value);
  };

  const handleSaveFramework = async () => {
    setSaveFrameworkDialogOpen(false);

    let preferences = selectedAdditionalIndicators.map((indicatorId) => ({
      indicator_id: indicatorId,
      weight: additionalIndicatorWeights[indicatorId.toString()] || 0,
    }));

    const selectedIndicators = Object.keys(indicatorWeights).map((key) => ({
      indicator_id: parseInt(key, 10),
      weight: indicatorWeights[key],
    }));

    // Merge the selected indicators array with selected additional indicators array
    preferences = preferences.concat(selectedIndicators);

    const payload = {
      name: customFrameworkName,
      description: customFrameworkDescription || "Custom Framework",
      preferences: preferences,
    };

    try {
      const response = await fetch("/api/custom-frameworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      setCustomFrameworkName("");
      setCustomFrameworkDescription("");
      setSuccessMessage("Custom framework saved successfully.");
      setSaveTrigger((prev) => !prev);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message || "There was an error saving the custom framework."
      );
    }
  };

  return (
    <Box sx={sidebarBoxStyle}>
      <SnackbarManager
        position={"bottom"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <Dialog open={isDialogOpen} onClose={closeWeightDialog}>
        <DialogTitle>Enter New Weight</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a value with at most 3 decimal places.
          </DialogContentText>
          <TextField
            error={isNaN(newWeightInput)}
            helperText={
              isNaN(newWeightInput) ? "Please enter a valid number." : ""
            }
            value={newWeightInput}
            onChange={handleNewWeightChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleWeightSave();
              }
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWeightDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleWeightSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <SidebarContext.Provider
        value={{
          frameworksData,
          customFrameworks,
          selectedFramework,
          selectedCustomFramework,
          handleFrameworkChange,
          frameworkMetrics,
          howManyIndicatorsChecked,
          handleMetricChange,
          metricWeights,
          handleWeightChange,
          isMetricExpanded,
          selectedIndicators,
          handleIndicatorChange,
          indicatorWeights,
          toggleMetric,
          additionalIndicators,
          selectedAdditionalIndicators,
          handleAdditionalIndicatorsChange,
          determineChipColor,
          additionalIndicatorWeights,
        }}
      >
        <ToggleDataView
          disabled={!selectedCompany}
          setDataView={setDataView}
          dataView={dataView}
          otherViewTitle={"Bar Chart View"}
        />
        <FrameworkAccordion
          disabled={!selectedCompany}
          expanded={expanded.panel1}
          onToggleDropdown={handleChange("panel1")}
          frameworksData={frameworksData}
        />
        {!selectedCustomFramework && (
          <MetricsIndicatorsAccordion
            disabled={!selectedCompany}
            expanded={expanded.panel2}
            onToggleDropdown={handleChange("panel2")}
          />
        )}
        <AdditionalIndicatorsAccordion
          disabled={!selectedCompany}
          expanded={expanded.panel3}
          onToggleDropdown={handleChange("panel3")}
        />
        <MultiSelectAccordion
          title={"Years"}
          disabled={!selectedCompany}
          expanded={expanded.panel4}
          onToggleDropdown={handleChange("panel4")}
          valuesList={yearsList}
          handleSelectChange={handleYearChange}
          allChecked={true}
        />
        <SidebarSaveButtons
          selectedFramework={selectedFramework}
          selectedAdditionalIndicators={selectedAdditionalIndicators}
          handleSaveFrameworkDialogToggle={handleSaveFrameworkDialogToggle}
          saveFrameworkDialogOpen={saveFrameworkDialogOpen}
          customFrameworkName={customFrameworkName}
          handleCustomFrameworkNameChange={handleCustomFrameworkNameChange}
          customFrameworkDescription={customFrameworkDescription}
          handleCustomFrameworkDescriptionChange={
            handleCustomFrameworkDescriptionChange
          }
          handleSaveFramework={handleSaveFramework}
          handleUpdateSelections={handleUpdateSelections}
        />
      </SidebarContext.Provider>
    </Box>
  );
}

export default SingleSidebar;
