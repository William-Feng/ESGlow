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
import { PageContext } from "../Dashboard";
import FrameworkAccordion from "../Accordion/FrameworkAccordion";
import MetricsIndicatorsAccordion from "../Accordion/MetricsIndicatorsAccordion";
import YearsAccordion from "../Accordion/YearsAccordion";
import AdditionalIndicatorsAccordion from "../Accordion/AdditionalIndicatorsAccordion";

export const SidebarContext = createContext();

/*
  selectedFramework: Nested Object that contains all metric and indicator information
    -> this information does NOT CHANGE with user selection; retrieved from database
  selectedIndicators: Array that contains the selected indicators by ID
    -> selectedIndicators array CHANGES with user selection from the sidebar
*/
function SingleViewSidebar() {
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
  } = useContext(PageContext);

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
      } else {
        return [...prevMetrics, metric];
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

  const openWeightDialog = (metricId, indicatorId) => {
    setIsDialogOpen(true);
    setNewWeightMetridId(metricId);
    setNewWeightIndicatorId(indicatorId);
  };

  const closeWeightDialog = () => {
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
    if (parseFloat(newWeightInput) > 0 && parseFloat(newWeightInput) <= 1) {
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
          years,
          handleYearChange,
          remainingExtraIndicators,
          selectedExtraIndicators,
          handleExtraIndicatorsChange,
        }}
      >
        <FrameworkAccordion
          disabled={!frameworksData}
          expanded={expanded.panel1}
          onChange={handleChange("panel1")}
        />
        <MetricsIndicatorsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel2}
          onChange={handleChange("panel2")}
        />
        <YearsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel3}
          onChange={handleChange("panel3")}
        />
        <AdditionalIndicatorsAccordion
          disabled={!frameworksData}
          expanded={expanded.panel4}
          onChange={handleChange("panel4")}
        />
      </SidebarContext.Provider>
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
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default SingleViewSidebar;
