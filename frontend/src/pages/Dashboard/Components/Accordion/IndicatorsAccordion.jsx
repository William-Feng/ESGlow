import { useContext } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ComparisonViewContext } from "../../ComparisonView/ComparisonView";

function IndicatorsAccordion({
  multi,
  disabled,
  expanded,
  onToggleDropdown,
  handleIndicatorsChange,
}) {
  const {
    selectedYear,
    selectedYearRange,
    indicatorsList,
    selectedIndicators,
  } = useContext(ComparisonViewContext);

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
          Indicators
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {selectedYear.length || selectedYearRange.length ? (
            indicatorsList.map((indicator) => (
              <Box
                key={indicator.indicator_id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1, pl: 2 }}
              >
                <FormControlLabel
                  control={
                    multi === true ? (
                      <Checkbox
                        checked={selectedIndicators.includes(
                          indicator.indicator_id
                        )}
                        onChange={() =>
                          handleIndicatorsChange(indicator.indicator_id)
                        }
                      />
                    ) : (
                      <Radio
                        checked={selectedIndicators.includes(
                          indicator.indicator_id
                        )}
                        onChange={() =>
                          handleIndicatorsChange(indicator.indicator_id)
                        }
                        value={indicator.indicator_id}
                      />
                    )
                  }
                  label={
                    <Typography style={{ maxWidth: 200, whiteSpace: "normal" }}>
                      {indicator.name}
                    </Typography>
                  }
                />
                <Box display="flex" alignItems="center" gap={1}>
                  <Tooltip title={indicator.indicator_description}>
                    <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Box>
              </Box>
            ))
          ) : (
            <Typography style={{ color: "red" }}>
              Select a year to see the associated indicators
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default IndicatorsAccordion;
