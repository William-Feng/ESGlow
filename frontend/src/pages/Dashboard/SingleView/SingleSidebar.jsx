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
    setSelectedIndicators([]);
    setSelectedExtraIndicators([]);
  }, [
    selectedCompany,
    setSelectedFramework,
    setSelectedIndicators,
    setSelectedExtraIndicators,
  ]);

  const frameworkMetrics = selectedFramework ? selectedFramework.metrics : [];

  const handleFrameworkChange = (event) => {
    const frameworkId = event.target.value;
    setSelectedFramework(
      frameworksData.find((f) => f.framework_id === parseInt(frameworkId))
    );
    setSelectedIndicators(
      frameworksData.flatMap((framework) =>
        framework.metrics.flatMap((metric) =>
          metric.indicators.map((indicator) => indicator.indicator_id)
        )
      )
    );
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

  const determineChipColor = (metric, indicator) => {
    if (metric) {
      const metricId = metric.metric_id;
      if (!selectedMetrics.find((m) => m.metric_id === metricId)) {
        return "error";
      } else if (
        Math.abs(
          metricWeights[metricId] - parseFloat(metric.predefined_weight)
        ) <= 0.0001
      ) {
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

  const openWeightDialog = (metricId, indicatorId) => {
    setIsDialogOpen(true);
    setNewWeightMetridId(metricId);
    setNewWeightIndicatorId(indicatorId);
  };

  const closeWeightDialog = () => {
    setNewWeightInput("");
    setIsDialogOpen(false);
  };

  const handleNewWeightChange = (e) => {
    setNewWeightInput(e.target.value);
  };

  const handleWeightChange = (metricId, indicatorId, e) => {
    e.stopPropagation();
    openWeightDialog(metricId, indicatorId);
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
  }, [allIndicators, selectedFramework]);

  const handleExtraIndicatorsChange = (indicatorId) => {
    setSelectedExtraIndicators((prev) => {
      if (prev.includes(indicatorId)) {
        return prev.filter((id) => id !== indicatorId);
      } else {
        return [...prev, indicatorId];
      }
    });
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  const handleSave = () => {
    // Update savedWeights with indicator and metric weights
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

  const handleSaveFrameworkDialogToggle = () => {
    setSaveFrameworkDialogOpen(!saveFrameworkDialogOpen);
  };

  const handleCustomFrameworkNameChange = (event) => {
    setCustomFrameworkName(event.target.value);
  };

  return (
    <Box sx={{ paddingBottom: 3 }}>
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
          selectedFramework,
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
        }}
      >
        <FrameworkAccordion
          disabled={!frameworksData}
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
          frameworksData={frameworksData}
        />
        <MetricsIndicatorsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel2}
          onChange={handleChange("panel2")}
        />
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
                Please enter a name for your custom framework.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="customFrameworkName"
                label="Unique Custom Framework Name"
                type="text"
                fullWidth
                variant="standard"
                value={customFrameworkName}
                onChange={handleCustomFrameworkNameChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveFrameworkDialogToggle}>Cancel</Button>
              {/* TODO: Add function 'handleSaveFramework' which triggers onClick to
              execute the POST request that saves the custom framework into the database */}
              <Button>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
}

export default SingleSidebar;
