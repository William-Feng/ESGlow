import React, { useEffect } from "react";
import {
  Box,
  Chip,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Tooltip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

/*
  selectedFramework: Nested Object that contains all metric and indicator information
    -> this information does NOT CHANGE with user selection; retrieved from database
  selectedIndicators: Array that contains the selected indicators by ID
    -> selectedIndicators array CHANGES with user selection from the sidebar
*/
export default function SelectionSidebar({
  frameworksData,
  years,
  selectedFramework,
  setSelectedFramework,
  selectedIndicators,
  setSelectedIndicators,
  setSelectedYears,
  setSavedWeights,
}) {

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

      // populate the metric and indicator weights with predefined weights
      const initialMetricWeights = {};
      const initialIndicatorWeights = {};
      selectedMetrics.forEach((metric) => {
        initialMetricWeights[metric.metric_id] = metric.predefined_weight;
        metric.indicators.forEach((indicator) => {
          initialIndicatorWeights[indicator.indicator_id] = indicator.predefined_weight;
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
  });

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

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

    // ensure metric is selected if indicator is selected
    setSelectedMetrics((prevMetrics) => {
      if (checked && prevMetrics.includes(metric)) {
        return [...prevMetrics];
      } else {
        return [...prevMetrics, metric];
      }
    });
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

  const handleMetricChange = (metric, event) => {
    const checked = event.target.checked

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

  const handleWeightChange = (metricId, indicatorId, e) => {
    e.stopPropagation();
    const newWeight = prompt("Enter the new weight:");

    if (parseFloat(newWeight) > 0 && parseFloat(newWeight) <= 1) {
      if (metricId) {
        setMetricWeights((prevMetrics) => ({
          ...prevMetrics,
          [metricId]: parseFloat(newWeight),
        }));
      } else if (indicatorId) {
        setIndicatorWeights((prevWeights) => ({
          ...prevWeights,
          [indicatorId]: parseFloat(newWeight),
        }));
      }
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = () => {
    if (!selectedFramework) {
      return setErrorMessage("No framework has been selected.");
    } else if (!selectedIndicators) {
      return setErrorMessage("No indicators have been selected.");
    }

    const totalMetricWeight = selectedMetrics.reduce((total, metric) =>
      total + metricWeights[metric.metric_id], 0
    );
    if (parseInt(totalMetricWeight) !== 1) {
      return setErrorMessage("Metric weights do not add up to 1.");
    }

    const hasError = selectedMetrics.some((metric) => {
      const totalIndicatorWeight = metric.indicators.reduce((total, indicator) => {
        return selectedIndicators.includes(indicator.indicator_id) 
          ? total + indicatorWeights[indicator.indicator_id] 
          : total;
      }, 0);
      return parseInt(totalIndicatorWeight) !== 1;
    });
    if (hasError) {
      return setErrorMessage("Indicator weights for some metrics do not add up to 1.")
    }

    // update savedWeights
    const newSavedWeights = {};
    selectedMetrics.forEach((metric) => {
      const metricId = metric.metric_id;
      const metricWeight = metricWeights[metricId];
      const indicators = {};
      metric.indicators.forEach((indicator) => {
        const indicatorId = indicator.indicator_id;
        const indicatorWeight = indicatorWeights[indicatorId];
        indicators[indicatorId] = indicatorWeight;
      });
      newSavedWeights[metricId] = {
        metric_id: metricId,
        metric_weight: metricWeight,
        indicators: indicators,
      };
    });
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
      
      <Accordion expanded={expanded.panel1} onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Frameworks
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={
                selectedFramework
                  ? selectedFramework.framework_id.toString()
                  : ""
              }
              onChange={handleFrameworkChange}
            >
              {frameworksData ? (
                frameworksData.map((framework) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    key={framework.framework_id}
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Radio value={framework.framework_id.toString()} />
                      <Typography fontWeight="bold">
                        {framework.framework_name}
                      </Typography>
                    </Box>
                    <Tooltip title={framework.description}>
                      <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                    </Tooltip>
                  </Box>
                ))
              ) : (
                <Typography style={{ color: "red" }}>
                  Select a company to see the associated frameworks
                </Typography>
              )}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel2} onChange={handleChange("panel2")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Metrics & Indicators
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {selectedFramework ? (
              frameworkMetrics.map((metric) => (
                <Box key={"_metric_" + metric.metric_id} sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      cursor: "pointer",
                      p: 0.5,
                      border: "1px solid",
                      borderRadius: "4px",
                      mb: 1,
                    }}
                    onClick={() => toggleMetric(metric.metric_id)}
                  >
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={
                          howManyIndicatorsChecked(metric) ===
                          metric.indicators.length
                        }
                        indeterminate={
                          howManyIndicatorsChecked(metric) <
                            metric.indicators.length &&
                          howManyIndicatorsChecked(metric) > 0
                        }
                        onChange={(e) => handleMetricChange(metric, e)}
                      />
                      <Typography fontWeight="bold">
                        {metric.metric_name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title={metric.description}>
                        <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                      </Tooltip>
                      <Chip
                        label={`${metricWeights[metric.metric_id]}`}
                        color="primary"
                        onClick={(e) => 
                          handleWeightChange(metric.metric_id, null, e)
                        }
                      />
                      <ExpandMoreIcon />
                    </Box>
                  </Box>
                  {isMetricExpanded(metric.metric_id) && (
                    <Box sx={{ mt: 1, pl: 5 }}>
                      {metric.indicators.map((indicator) => (
                        <Box
                          key={indicator.indicator_id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                key={"_checkbox_" + indicator.indicator_id}
                                checked={
                                  selectedIndicators.includes(
                                    indicator.indicator_id
                                  ) || false
                                }
                                onChange={(e) =>
                                  handleIndicatorChange(
                                    metric, 
                                    indicator.indicator_id, 
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={indicator.indicator_name}
                          />
                          <Box display="flex" alignItems="center" gap={1}>
                            <Tooltip title={indicator.description}>
                              <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                            </Tooltip>
                            <Chip
                              label={`${indicatorWeights[indicator.indicator_id]}`}
                              color={
                                selectedIndicators.includes(indicator.indicator_id) 
                                ? "success" 
                                : "error"
                              }
                              onClick={(e) => 
                                handleWeightChange(null, indicator.indicator_id, e)
                              }
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography style={{ color: "red" }}>
                Select a framework to see the associated metrics and indicators
              </Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel3} onChange={handleChange("panel3")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Years
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {years.map((y) => (
                <FormControlLabel
                  key={y}
                  value={y}
                  control={
                    <Checkbox
                      defaultChecked
                      onChange={() => handleYearChange(y)}
                    />
                  }
                  label={y}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Box sx={{
        mt: 2,
        mr: 2,
        display: "flex",
        justifyContent: "right",
      }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
