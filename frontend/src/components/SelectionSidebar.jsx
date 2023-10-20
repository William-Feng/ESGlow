import React from "react";
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
  Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";

export default function SelectionSidebar({
  frameworksData,
  years,
  selectedFramework,
  setSelectedFramework,
  selectedIndicators,
  setSelectedIndicators,
  setSelectedYears,
}) {

  const handleFrameworkChange = (event) => {
    const frameworkId = event.target.value;
    setSelectedFramework(
      frameworksData.find((f) => f.framework_id === parseInt(frameworkId))
    );
    setSelectedIndicators(frameworksData.flatMap((framework) =>
      framework.metrics.flatMap((metric) =>
        metric.indicators.map((indicator) => indicator.indicator_id)
      )
    ))
  };

  const selectedMetrics = selectedFramework ? selectedFramework.metrics : [];

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

  const handleIndicatorChange = (indicatorId, checked) => {
    setSelectedIndicators((prevIndicators) => {
      if (checked) {
        return [...prevIndicators, indicatorId];
      } else {
        return prevIndicators.filter((id) => id !== indicatorId);
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

  const updateMetricIndicators = (indicators, event) => {
    const checked = event.target.checked

    setSelectedIndicators((prevIndicators) => {
      const updatedIndicators = prevIndicators.filter(
        (id) => !indicators.some((indicator) => indicator.indicator_id === id)
      );

      return checked
        ? [...updatedIndicators, ...indicators.map((indicator) => indicator.indicator_id)]
        : updatedIndicators;
    });
  };

  function howManyIndicatorsChecked(metric) {
    const indicatorList = metric.indicators.map((indicator) => indicator.indicator_id);
    // check how many of the IDs in indicatorList is in selectedIndicators
    const checkedIndicators = indicatorList.filter((indicatorId) =>
      selectedIndicators.includes(indicatorId)
    );
    // Return the count of checked indicators
    return checkedIndicators.length;
  }

  const [indicatorWeights, setIndicatorWeights] = useState({});

  const handleWeightChange = (indicatorId, newWeight) => {
    setIndicatorWeights((prevWeights) => ({
      ...prevWeights,
      [indicatorId]: newWeight,
    }));
  };
  
  return (
    <Box>
      <Accordion expanded={expanded.panel1} onChange={handleChange("panel1")}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Framework
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
              {frameworksData ?
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
              :
              (
                <Typography style={{ color: "red" }}>
                  Select a company to see the associated frameworks
                </Typography>
              )
            }
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
              selectedMetrics.map((metric) => (
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
                        checked={howManyIndicatorsChecked(metric) === metric.indicators.length}
                        indeterminate={
                          howManyIndicatorsChecked(metric) < metric.indicators.length
                          && howManyIndicatorsChecked(metric) > 0
                        }
                        onChange={(e) => updateMetricIndicators(metric.indicators, e)}
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
                        label={`${metric.predefined_weight}`}
                        color="primary"
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
                                checked={selectedIndicators.includes(indicator.indicator_id)|| false}
                                onChange={(e) =>
                                  handleIndicatorChange(indicator.indicator_id, e.target.checked)
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
                              label={`${indicatorWeights[indicator.indicator_id] || indicator.predefined_weight}`}
                              color={selectedIndicators.includes(indicator.indicator_id) ? "success" : "warning"}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newWeight = prompt("Enter the new weight for this indicator:");
                                if (parseFloat(newWeight) > 0 && parseFloat(newWeight) <= 1) {
                                  handleWeightChange(indicator.indicator_id, parseFloat(newWeight));
                                }
                              }}
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
    </Box>
  );
}
