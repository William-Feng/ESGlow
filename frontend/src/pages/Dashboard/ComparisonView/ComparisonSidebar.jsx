import {
  Box,
  Button
} from "@mui/material";
import YearsAccordion from "../Components/Accordion/YearsAccordion";

/* These are dummy variables for placeholder */
const years = [2020, 2023];
const dummyFunction = () => {};

export default function ComparisonSidebar() {

  return (
    <Box sx={{ paddingBottom: 3 }}>
      {/* Should modularize the indicators/weight Accordion to add here */}
      <YearsAccordion
        disabled={false} // Depending on some sort of selection
        expanded={true}
        onChange={dummyFunction}
        years={years}
        handleYearChange={dummyFunction}
      />
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
