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

function YearsMultiAccordion({
  disabled,
  expanded,
  onChange,
  years,
  handleYearChange,
  borderRequired,
}) {
  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3bh-content"
        id="panel3bh-header"
        sx={{
          ...(borderRequired && { borderTop: "1px solid rgba(0, 0, 0, 0.12)" }),
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
          {years.map((year) => (
            <FormControlLabel
              key={year}
              value={year}
              control={
                <Checkbox
                  defaultChecked
                  onChange={() => handleYearChange(year)}
                />
              }
              label={<Typography fontWeight="bold">{year}</Typography>}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default YearsMultiAccordion;
