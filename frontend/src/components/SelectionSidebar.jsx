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
import { Fragment, useEffect, useState } from "react";

const years = [2021, 2022, 2023];

export default function SelectionSidebar({ token }) {
  const [frameworksData, setFrameworksData] = useState([]);

  useEffect(() => {
    // This will be hard coded until the company selection is implemented
    const companyId = 1;

    fetch(`/api/frameworks/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", JSON.stringify(data));
        setFrameworksData(data);
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the framework, metric and indicator information!",
          error
        )
      );
  }, [token]);

  const metrics = frameworksData.flatMap((framework) => framework.metrics);
  const indicators = metrics.flatMap((metric) => metric.indicators);

  const [expanded, setExpanded] = useState(false);
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
              <Fragment
                key={"framework_" + m.framework_id + "_metric_" + m.metric_id}
              >
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={m.metric_name}
                    />
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
                        {m.indicators.map((i) => (
                          <Fragment key={"indicator_" + i.indicator_id}>
                            <FormControlLabel
                              value={i.indicator_id.toString()}
                              control={<Checkbox />}
                              label={i.indicator_name}
                            />
                          </Fragment>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>
              </Fragment>
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
