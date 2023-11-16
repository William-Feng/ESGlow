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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { SidebarContext } from "../../SingleMode/SingleSidebar";
import { accordionSummaryFont } from "../../../../styles/FontStyle";

function FrameworkAccordion({ disabled, expanded, onToggleDropdown }) {
  const {
    frameworksData,
    customFrameworks,
    selectedFramework,
    selectedCustomFramework,
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
    <Accordion
      disabled={disabled}
      expanded={expanded}
      onChange={onToggleDropdown}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Typography sx={accordionSummaryFont}>Frameworks</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl fullWidth>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={
              selectedFramework
                ? `default-${selectedFramework.framework_id}`
                : selectedCustomFramework
                ? `custom-${selectedCustomFramework.framework_id}`
                : ""
            }
            onChange={handleFrameworkChange}
          >
            {combinedFrameworksData.map((framework) => (
              <Box
                display="flex"
                alignItems="center"
                key={framework.unique_id}
                justifyContent="space-between"
                sx={{
                  // Add a border and background colour for the selected framework
                  border:
                    `default-${selectedFramework?.framework_id}` ===
                      framework.unique_id ||
                    `custom-${selectedCustomFramework?.framework_id}` ===
                      framework.unique_id
                      ? "1px solid rgba(0, 0, 0, 0.12)"
                      : "none",
                  bgcolor:
                    `default-${selectedFramework?.framework_id}` ===
                      framework.unique_id ||
                    `custom-${selectedCustomFramework?.framework_id}` ===
                      framework.unique_id
                      ? "action.hover"
                      : "transparent",
                  borderRadius: "4px",
                  p: 0.5,
                }}
              >
                <Box display="flex" alignItems="center">
                  <Radio value={framework.unique_id} />
                  <Typography
                    fontWeight="bold"
                    sx={{
                      color: framework.isCustom ? "#0039a6" : "text.primary",
                    }}
                  >
                    {framework.framework_name}
                  </Typography>
                  {framework.isCustom && (
                    <StarBorderIcon sx={{ ml: 1, color: "#0039a6" }} />
                  )}
                </Box>
                <Tooltip title={framework.description}>
                  <InfoOutlinedIcon
                    style={{
                      cursor: "pointer",
                      color: framework.isCustom ? "#0039a6" : "text.primary",
                    }}
                  />
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
