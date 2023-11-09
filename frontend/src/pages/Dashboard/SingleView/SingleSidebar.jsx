import { createContext, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { SingleViewContext } from "./SingleView";
import FrameworkAccordion from "../Components/Accordion/FrameworkAccordion";
import MetricsIndicatorsAccordion from "../Components/Accordion/MetricsIndicatorsAccordion";
import YearsAccordion from "../Components/Accordion/YearsAccordion";
import AdditionalIndicatorsAccordion from "../Components/Accordion/AdditionalIndicatorsAccordion";

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
    years,
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
    selectedExtraIndicators,
    setSelectedExtraIndicators,
  } = useContext(SingleViewContext);

  // Reset the states if the company is changed or deleted
  // Note that selected extra indicators remain the same if a new framework is selected
  useEffect(() => {
    setSelectedFramework(null);
    setSelectedCustomFramework(null);
    setSelectedIndicators([]);
    setSelectedExtraIndicators([]);
  }, [
    selectedCompany,
    setSelectedFramework,
    setSelectedCustomFramework,
    setSelectedIndicators,
    setSelectedExtraIndicators,
  ]);

  // Custom Frameworks
  const [customFrameworks, setCustomFrameworks] = useState([]);

  useEffect(() => {
    fetch("/api/custom-frameworks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data.custom_frameworks);
        setCustomFrameworks(data.custom_frameworks);
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the custom frameworks.",
          error
        )
      );
  }, [token]);

  // Standard Framework logic below
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
      // Set indicators for custom framework
    } else {
      setSelectedFramework(
        frameworksData.find((f) => f.framework_id === frameworkId)
      );
      setSelectedCustomFramework(null);
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
    if (!frameworksData) {
      setExpanded({
        panel1: false,
        panel2: false,
        panel3: false,
        panel4: false,
      });
    }
  }, [frameworksData]);

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
    setSelectedIndicators((prevIndicators) => {
      if (checked) {
        return [...prevIndicators, indicatorId];
      } else {
        return prevIndicators.filter((id) => id !== indicatorId);
      }
    });

    // Ensure metric is selected if indicator is selected
    setSelectedMetrics((prevMetrics) => {
      if (checked && !prevMetrics.includes(metric)) {
        return [...prevMetrics, metric];
      } else if (howManyIndicatorsChecked(metric) === 0) {
        return prevMetrics.filter((m) => m !== metric);
      } else {
        return [...prevMetrics];
      }
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
        // Return red if weight has been deselected
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

  const handleWeightSave = async () => {
    if (parseFloat(newWeightInput) > 0 && parseFloat(newWeightInput) <= 1) {
      if (newWeightAdditionalIndicatorId) {
        setAdditionalIndicatorWeights((prevWeights) => ({
          ...prevWeights,
          [newWeightAdditionalIndicatorId]: parseFloat(
            parseFloat(newWeightInput).toFixed(3)
          ),
        }));
      } else if (newWeightMetridId) {
        setMetricWeights((prevWeights) => ({
          ...prevWeights,
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
      }
      closeWeightDialog();
    }
  };

  const handleYearChange = (year) => {
    setSelectedYears((prevYears) => {
      if (prevYears.includes(year)) {
        return prevYears.filter((y) => y !== year);
      } else {
        return [...prevYears, year];
      }
    });
  };

  const [remainingExtraIndicators, setRemainingExtraIndicators] = useState([]);
  const [additionalIndicatorWeights, setAdditionalIndicatorWeights] = useState(
    []
  );

  // Discover the indicators that are not in the selected framework
  useEffect(() => {
    const frameworkIndicatorIds = selectedFramework
      ? selectedFramework.metrics
          .reduce((acc, metric) => acc.concat(metric.indicators), [])
          .map((indicator) => indicator.indicator_id)
      : [];

    const filtered_indicators = allIndicators.filter(
      (indicator) => !frameworkIndicatorIds.includes(indicator.indicator_id)
    );

    setRemainingExtraIndicators(filtered_indicators);
    const filteredIndicatorWeights = {};
    filtered_indicators.forEach((indicator) => {
      filteredIndicatorWeights[indicator.indicator_id] = 0;
    });
    setAdditionalIndicatorWeights(filteredIndicatorWeights);
  }, [allIndicators, selectedFramework]);

  const handleExtraIndicatorsChange = (indicatorId) => {
    setSelectedExtraIndicators((prev) => {
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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = () => {
    const totalMetricWeight = selectedMetrics.reduce(
      (total, metric) => total + metricWeights[metric.metric_id],
      0
    );
    if (Math.abs(totalMetricWeight - 1) > 0.0001) {
      return setErrorMessage("Metric weights do not add up to 1.");
    }

    const hasError = selectedMetrics.some((metric) => {
      const totalIndicatorWeight = metric.indicators.reduce(
        (total, indicator) => {
          return selectedIndicators.includes(indicator.indicator_id)
            ? total + indicatorWeights[indicator.indicator_id]
            : total;
        },
        0
      );
      return Math.abs(totalIndicatorWeight - 1) > 0.001;
    });
    if (hasError) {
      return setErrorMessage(
        "Indicator weights for some metrics do not add up to 1."
      );
    }

    // Update savedWeights
    const newSavedWeights = {};
    const savedMetricsList = [];
    selectedMetrics.forEach((metric) => {
      const metricId = metric.metric_id;
      const metricWeight = metricWeights[metricId];
      const indicators = [];
      metric.indicators.forEach((indicator) => {
        const indicatorId = indicator.indicator_id;
        const indicatorWeight = indicatorWeights[indicatorId];
        indicators.push({
          indicator_id: indicatorId,
          indicator_weight: indicatorWeight,
        });
      });
      savedMetricsList.push({
        metric_id: metricId,
        metric_weight: metricWeight,
        indicators: indicators,
      });
    });
    newSavedWeights["metrics"] = savedMetricsList;
    newSavedWeights["year"] = Math.max(...selectedYears);
    setSavedWeights(newSavedWeights);

    return setSuccessMessage("Preferences saved successfully.");
  };

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

    let preferences = selectedExtraIndicators.map((indicatorId) => ({
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

      setSuccessMessage("Custom framework saved successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message || "There was an error saving the custom framework."
      );
    }
  };

  return (
    <Box sx={{ paddingBottom: 3 }}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success">{successMessage}</Alert>
      </Snackbar>
      <Dialog open={isDialogOpen} onClose={closeWeightDialog}>
        <DialogTitle>Enter New Weight</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a value between 0 and 1 with at most 3 decimal places.
          </DialogContentText>
          <TextField
            error={
              parseFloat(newWeightInput) <= 0 || parseFloat(newWeightInput) > 1
            }
            helperText={
              parseFloat(newWeightInput) <= 0 || parseFloat(newWeightInput) > 1
                ? "Value must be between 0 and 1."
                : ""
            }
            value={newWeightInput}
            onChange={handleNewWeightChange}
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
          remainingExtraIndicators,
          selectedExtraIndicators,
          handleExtraIndicatorsChange,
          determineChipColor,
          additionalIndicatorWeights,
        }}
      >
        <FrameworkAccordion
          disabled={!frameworksData}
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
          frameworksData={frameworksData}
        />
        {!selectedCustomFramework && (
          <MetricsIndicatorsAccordion
            disabled={!frameworksData}
            expanded={expanded.panel2}
            onChange={handleChange("panel2")}
          />
        )}
        <AdditionalIndicatorsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel3}
          onChange={handleChange("panel3")}
        />
        <YearsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel4}
          onChange={handleChange("panel4")}
          years={years}
          handleYearChange={handleYearChange}
        />
      </SidebarContext.Provider>
      {/* TODO: Abstract the buttons below into separate components */}
      {selectedFramework && (
        <Box
          sx={{
            mt: 2,
            mr: 2,
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSave}>
            Update Score
          </Button>
        </Box>
      )}
      {(selectedFramework || selectedExtraIndicators.length > 0) && (
        <Box
          sx={{
            mt: 2,
            ml: 2,
            display: "flex",
            justifyContent: "left",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveFrameworkDialogToggle}
          >
            Save Custom Framework
          </Button>
          <Dialog
            open={saveFrameworkDialogOpen}
            onClose={handleSaveFrameworkDialogToggle}
          >
            <DialogTitle>Save Custom Framework</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name and description for your custom framework.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="customFrameworkName"
                label="Unique Custom Framework Name"
                type="text"
                fullWidth
                required
                variant="standard"
                value={customFrameworkName}
                onChange={handleCustomFrameworkNameChange}
              />
              <TextField
                margin="dense"
                id="customFrameworkDescription"
                label="Description (Optional)"
                type="text"
                fullWidth
                variant="standard"
                value={customFrameworkDescription}
                onChange={handleCustomFrameworkDescriptionChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveFrameworkDialogToggle}>Cancel</Button>
              <Button onClick={handleSaveFramework}>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

export default SingleSidebar;
