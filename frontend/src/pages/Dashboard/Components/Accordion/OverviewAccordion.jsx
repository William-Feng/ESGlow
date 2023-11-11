import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SingleOverview from '../../../Dashboard/SingleView/SingleOverview';
import ComparisonOverview from '../../../Dashboard/ComparisonView/ComparisonOverview';

export default function OverviewAccordion({
  isSingleView,
  isDisabled,
  overviewExpanded,
  setOverviewExpanded
}) {
  return (
    <Accordion
        disabled={isDisabled}
        expanded={overviewExpanded}
        onChange={(_, val) => setOverviewExpanded(val)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{
            width: '20%',
            flexShrink: 0,
            fontSize: "1.2rem",
            fontWeight: "bold",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            Overview
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              textAlign: "center",
              maxHeight: "320px",
            }}
          >
            {isSingleView ?
              <SingleOverview/>
              :
              <ComparisonOverview/>
            }
          </Box>
        </AccordionDetails>
    </Accordion>
  )
}
