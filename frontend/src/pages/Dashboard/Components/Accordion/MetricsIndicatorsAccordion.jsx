import React, { useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Box,
  Chip,
  Tooltip,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SidebarContext } from "../../SingleMode/SingleSidebar";
import { accordionSummaryFont } from "../../../../styles/FontStyle";

function MetricsIndicatorsAccordion({ disabled, expanded, onToggleDropdown }) {
  const {
    selectedFramework,
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
    determineChipColor,
  } = useContext(SidebarContext);

  return (
    <Accordion
      disabled={disabled}
      expanded={expanded}
      onChange={onToggleDropdown}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
      >
        <Typography sx={accordionSummaryFont}>Metrics & Indicators</Typography>
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
                      color={determineChipColor(metric, null)}
                      onClick={(e) =>
                        handleWeightChange(e, metric.metric_id, null, false)
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
                            label={`${
                              indicatorWeights[indicator.indicator_id]
                            }`}
                            color={determineChipColor(null, indicator)}
                            onClick={(e) =>
                              handleWeightChange(
                                e,
                                null,
                                indicator.indicator_id,
                                false
                              )
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
              Select a framework to see the associated metrics and indicators.
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default MetricsIndicatorsAccordion;
