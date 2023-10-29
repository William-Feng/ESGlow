import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function YearsAccordion({ disabled, expanded, onChange, years, handleYearChange }) {

  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onChange}>
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
        <Box flexWrap="wrap" display="flex" width="100%" px={2}>
          {years.map((y, idx) => (
            <Box
              key={y}
              flex={1}
              width="50%"
              display="flex"
              justifyContent={idx % 2 === 0 ? "flex-start" : "center"}
              ml={idx % 2 === 0 ? 0 : -2}
            >
              <FormControlLabel
                value={y}
                control={
                  <Checkbox
                    defaultChecked
                    onChange={() => handleYearChange(y)}
                  />
                }
                label={<Typography fontWeight="bold">{y}</Typography>}
              />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default YearsAccordion;
