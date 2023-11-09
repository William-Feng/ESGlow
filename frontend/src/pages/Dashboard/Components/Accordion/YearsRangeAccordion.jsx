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
import { ComparisonSidebarContext } from "../../ComparisonView/ComparisonSidebar";

function YearsRangeAccordion({ disabled, expanded, onChange }) {
  const {
    yearsList,
    setSelectedYear
  } = useContext(ComparisonSidebarContext);


  const [yearRange, setYearRange] = useState([0, 0])
  const [minMaxRange, setMinMaxRange] = useState([0,0])

  useEffect(() => {
    // initializing the range of years available for slider
    if (yearsList) {
      setMinMaxRange([Math.min(...yearsList), Math.max(...yearsList)])
      setYearRange([Math.min(...yearsList), Math.max(...yearsList)])
    }
  }, [yearsList])

  const handleSliderChange = (_, newRange) => {
    setYearRange(newRange);
    setSelectedYear(
      yearsList.filter((year) => (year >= newRange[0] && year <= newRange[1]))
    )
  }

  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onChange}>
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
            // getAriaLabel={() => 'Temperature range'}
            value={yearRange}
            min={minMaxRange[0]|| 0}
            max={minMaxRange[1] || 0}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
          />  
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default YearsRangeAccordion;
