import React from "react";
import {
  Box,
  FormControl,
  RadioGroup,
  Radio,
  Typography,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const metrics = ["metric A", "metric B", "metric C"];
const indicators = ["indicator X", "indicator Y", "indicator Z"];
const years = [2021, 2022, 2023];

export default function SelectionSidebar() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {/* <AccordionDetails sx={{ maxHeight: "300px", overflowY: "scroll" }}></AccordionDetails> */}
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Framework
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              // value={value}
              // onChange={handleChange}
            >
              {/* placeholder values for framework */}
              <FormControlLabel
                value="frameworkA"
                control={<Radio />}
                label="Framework A"
              />
              <FormControlLabel
                value="frameworkB"
                control={<Radio />}
                label="Framework B"
              />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Metrics</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            {/* Below is the list of frameworks */}
            {metrics.map((m) => (
              <>
                <Accordion key={m}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel control={<Checkbox />} label={m} />
                  </AccordionSummary>

                  {/* Below is the list of indicators */}
                  <AccordionDetails>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        // value={value}
                        // onChange={handleChange}
                      >
                        {/* Placeholder values for indicators */}
                        {indicators.map((i) => (
                          <>
                            <FormControlLabel
                              value={i}
                              control={<Checkbox />}
                              label={i}
                            />
                          </>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </>
            ))}
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Years</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              // value={value}
              // onChange={handleChange}
            >
              {/* Placeholder values for years */}
              {years.map((y) => (
                <>
                  <FormControlLabel
                    value={y}
                    control={<Checkbox />}
                    label={y}
                  />
                </>
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
        sx={{ mt: "20px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Weightings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Users will be able to customise metric and indicator weights.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
