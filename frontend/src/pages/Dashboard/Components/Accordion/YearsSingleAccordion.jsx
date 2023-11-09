import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ComparisonSidebarContext } from "../../ComparisonView/ComparisonSidebar";

function YearsSingleAccordion({ disabled, expanded, onChange }) {
  const {
    yearsList,
    selectedYear,
    setSelectedYear
  } = useContext(ComparisonSidebarContext);
  
  const handleYearSelect = (_, value) => {
    setSelectedYear([parseInt(value)]);
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
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            width: "100%",
            px: 2,
          }}
        >
          {yearsList &&
            yearsList.map((year) => (
              <FormControl fullWidth key={year}>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={selectedYear[0] ? selectedYear[0].toString() : ""}
                  onChange={handleYearSelect}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    key={year}
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Radio value={year.toString()} />
                      <Typography fontWeight="bold">{year}</Typography>
                    </Box>
                  </Box>
                </RadioGroup>
              </FormControl>
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default YearsSingleAccordion;
