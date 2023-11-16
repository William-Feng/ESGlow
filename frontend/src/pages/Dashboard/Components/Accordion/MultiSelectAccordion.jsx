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
import { accordionSummaryFont } from "../../../../styles/fontStyle";

function MultiSelectAccordion({
  title,
  disabled,
  expanded,
  onToggleDropdown,
  valuesList,
  handleSelectChange,
  borderRequired,
  allChecked
}) {
  return (
    <Accordion disabled={disabled} expanded={expanded} onChange={onToggleDropdown}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3bh-content"
        id="panel3bh-header"
        sx={{
          ...(borderRequired && { borderTop: "1px solid rgba(0, 0, 0, 0.12)" }),
        }}
      >
        <Typography
          sx={accordionSummaryFont}
        >
          {title}
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
          {valuesList.map((value) => (
            <FormControlLabel
              key={value}
              value={value}
              control={
                <Checkbox
                  defaultChecked={allChecked || false}
                  onChange={() => handleSelectChange(value)}
                />
              }
              label={<Typography fontWeight="bold">{value}</Typography>}
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

export default MultiSelectAccordion;
