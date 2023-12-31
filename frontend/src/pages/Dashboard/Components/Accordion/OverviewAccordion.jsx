import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SingleOverview from "../../SingleMode/SingleOverview";
import ComparisonOverview from "../../ComparisonMode/ComparisonOverview";
import { accordionSummaryFont } from "../../../../styles/FontStyle";

function OverviewAccordion({
  isSingleMode,
  isDisabled,
  overviewExpanded,
  setOverviewExpanded,
  token,
}) {
  return (
    <Accordion
      disabled={isDisabled}
      expanded={overviewExpanded}
      onChange={(_, val) => setOverviewExpanded(val)}
      sx={{
        boxShadow: "none",
        "&.Mui-expanded": {
          margin: "0",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography
          sx={{
            width: "20%",
            ...accordionSummaryFont,
          }}
        >
          Overview
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          {isSingleMode ? (
            <SingleOverview token={token} />
          ) : (
            <ComparisonOverview token={token} />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default OverviewAccordion;
