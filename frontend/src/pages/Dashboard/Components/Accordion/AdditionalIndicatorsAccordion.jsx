import React, { useContext } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SidebarContext } from "../../SingleView/SingleSidebar";

function AdditionalIndicatorsAccordion({ disabled, expanded, onChange }) {
  const {
    remainingExtraIndicators,
    selectedExtraIndicators,
    handleExtraIndicatorsChange,
    additionalIndicatorWeights,
    handleWeightChange,
  } = useContext(SidebarContext);

  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2bh-content"
        id="panel2bh-header"
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Additional Indicators
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Typography style={{ color: "red", paddingBottom: "24px" }}>
            Note that the following indicators are not included in the selected
            framework and will not affect the ESG Score of the table. The
            adjustable weights are solely for creating a custom framework.
          </Typography>
          {remainingExtraIndicators.map((indicator) => (
            <Box
              key={indicator.indicator_id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1, pl: 2 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      selectedExtraIndicators.includes(
                        indicator.indicator_id
                      ) || false
                    }
                    onChange={() =>
                      handleExtraIndicatorsChange(indicator.indicator_id)
                    }
                  />
                }
                label={
                  <Typography style={{ maxWidth: 200, whiteSpace: "normal" }}>
                    {indicator.name}
                  </Typography>
                }
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title={indicator.description}>
                  <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                </Tooltip>
                <Chip
                  label={`${
                    additionalIndicatorWeights[indicator.indicator_id]
                  }`}
                  color={
                    selectedExtraIndicators.includes(indicator.indicator_id)
                      ? "primary"
                      : "default"
                  }
                  onClick={(e) =>
                    handleWeightChange(e, null, indicator.indicator_id, true)
                  }
                />
              </Box>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default AdditionalIndicatorsAccordion;
