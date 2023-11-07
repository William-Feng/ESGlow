import React, { useContext, useMemo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  Box,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { SidebarContext } from "../../SingleView/SingleSidebar";

function FrameworkAccordion({ disabled, expanded, onChange }) {
  const {
    frameworksData,
    customFrameworks,
    selectedFramework,
    handleFrameworkChange,
  } = useContext(SidebarContext);

  // Combine the default frameworks and custom frameworks with differentiation
  const combinedFrameworksData = useMemo(() => {
    const defaultFrameworks = (frameworksData || []).map((framework) => ({
      ...framework,
      isCustom: false,
      unique_id: `default-${framework.framework_id}`,
    }));
    const customFrameworksWithFlag = (customFrameworks || []).map(
      (framework) => ({
        ...framework,
        isCustom: true,
        unique_id: `custom-${framework.framework_id}`,
      })
    );
    return [...defaultFrameworks, ...customFrameworksWithFlag];
  }, [frameworksData, customFrameworks]);

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
          Frameworks
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selectedFramework ? selectedFramework.unique_id : ""}
            onChange={handleFrameworkChange}
          >
            {combinedFrameworksData.map((framework) => (
              <Box
                display="flex"
                alignItems="center"
                key={framework.unique_id}
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Radio value={framework.framework_id.toString()} />
                  <Typography fontWeight="bold">
                    {framework.framework_name}
                  </Typography>
                </Box>
                <Tooltip title={framework.description}>
                  <InfoOutlinedIcon style={{ cursor: "pointer" }} />
                </Tooltip>
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
}

export default FrameworkAccordion;
