import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Slider,
  Typography,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ComparisonViewContext } from "../../ComparisonView/ComparisonView";
import { accordionSummaryFont } from "../../../../styles/fontStyle";

const minDistance = 1;  // constant for minimum slider range => ie.) minimum (n+1) years are shown

function YearsRangeAccordion({ disabled, expanded, onToggleDropdown }) {
  const {
    yearsList,
    setSelectedYearRange
  } = useContext(ComparisonViewContext);


  const [yearRange, setYearRange] = useState([0, 0])
  const [minMaxRange, setMinMaxRange] = useState([0,0])

  useEffect(() => {
    // initializing the range of years available for slider
    if (yearsList) {
      setMinMaxRange([Math.min(...yearsList), Math.max(...yearsList)])
      setYearRange([Math.min(...yearsList), Math.max(...yearsList)])
    }
  }, [yearsList])

  const handleSliderChange = (_, newRange, active) => {
    // enforcing minimum slider distance, so no "overlap" nor single select
    if (active === 0) {
      const lower = Math.min(newRange[0], yearRange[1] - minDistance);
      setYearRange([lower, yearRange[1]]);
      setSelectedYearRange(
        yearsList.filter((year) => (year >= lower && year <= newRange[1]))
      )
    } else {
      const upper = Math.max(newRange[1], yearRange[0] + minDistance)
      setYearRange([yearRange[0], upper]);
      setSelectedYearRange(
        yearsList.filter((year) => (year >= newRange[0] && year <= upper))
      )
    }
  }

  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onToggleDropdown}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Typography
          sx={accordionSummaryFont}
        >
          Years
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Slider
            sx={{
              m: '15px'
            }}
            marks={[
              { value: minMaxRange[0], label: minMaxRange[0] },
              { value: minMaxRange[1], label: minMaxRange[1] }
            ]}
            value={yearRange}
            min={minMaxRange[0]|| 0}
            max={minMaxRange[1] || 0}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            disableSwap
          />  
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default YearsRangeAccordion;
