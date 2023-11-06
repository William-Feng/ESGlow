import { useContext } from "react";
import { ComparisonSidebarContext } from "../../ComparisonView/ComparisonSidebar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function IndicatorsAccordion({ disabled, expanded, onChange }) {
  const {
    selectedYear,
    indicatorsList,
    selectedIndicators,
    handleIndicatorsChange,
  } = useContext(ComparisonSidebarContext);

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
          Indicators
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          {selectedYear ? (
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
                    <Checkbox
                      checked={
                        selectedIndicators.includes(indicator.indicator_id) ||
                        false
                      }
                      onChange={() =>
                        handleIndicatorsChange(indicator.indicator_id)
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
