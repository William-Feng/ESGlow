import {
  Box,
  Button
} from "@mui/material";
import YearsAccordion from "../Components/Accordion/YearsAccordion";
import AdditionalIndicatorsAccordion from "../Components/Accordion/AdditionalIndicatorsAccordion";

// export const SidebarContext = createContext();

export default function ComparisonSidebar() {
  return (
    <Box sx={{ paddingBottom: 3 }}>
      {/* Call the Accordion components needed with the props */}
      <Box
        sx={{
          mt: 2,
          mr: 2,
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button variant="contained" color="primary" >
          Save
        </Button>
      </Box>
    </Box>
  )
}
