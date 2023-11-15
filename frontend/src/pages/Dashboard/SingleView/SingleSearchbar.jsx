import {
  Autocomplete,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { SingleViewContext } from "./SingleView";
import { useCompanyData } from "../../../hooks/UseCompanyData";
import useIndustryData from "../../../hooks/UseIndustryData";

function SingleSearchbar({ token }) {
  const {
    selectedIndustry,
    setSelectedIndustry,
    selectedCompany,
    setSelectedCompany,
    view,
    setView,
  } = useContext(SingleViewContext);

  const { industryList } = useIndustryData(token, null, null);
  const companyList = useCompanyData(selectedIndustry, token);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Autocomplete
        disablePortal
        onChange={(_, i) => {
          setSelectedIndustry(i || null);
          setSelectedCompany(null);
        }}
        options={industryList}
        sx={{
          width: "300px",
          backgroundColor: "white",
          borderRadius: 1,
        }}
        renderInput={(params) => <TextField {...params} label="Industry" />}
      />
      <Autocomplete
        disablePortal
        value={selectedCompany ? selectedCompany.name : null}
        onChange={(_, c) => {
          setSelectedCompany(
            companyList.find((company) => company.name === c) || null
          );
        }}
        options={companyList.map((c) => c.name)}
        noOptionsText={
          selectedIndustry ? "No options available" : "Select an industry first"
        }
        sx={{
          width: "300px",
          backgroundColor: selectedIndustry ? "white" : "#E8E8E8",
          borderRadius: 1,
        }}
        renderInput={(params) => <TextField {...params} label="Company" />}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e) => setView(e.currentTarget.value)}
        aria-label="company view"
        sx={{
          backgroundColor: "white",
        }}
      >
        <ToggleButton
          value="single"
          sx={{
            backgroundColor: view === "single" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography
            variant="body4"
            textAlign="center"
            sx={{
              fontSize: "14px",
              "@media (min-width: 768px)": {
                fontSize: "10px",
              },
              "@media (min-width: 1024px)": {
                fontSize: "14px",
              },
            }}
          >
            Single Company View
          </Typography>
        </ToggleButton>
        <ToggleButton
          value="multiple"
          sx={{
            backgroundColor: view === "multiple" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography
            variant="body4"
            textAlign="center"
            sx={{
              fontSize: "14px",
              "@media (min-width: 768px)": {
                fontSize: "10px",
              },
              "@media (min-width: 1024px)": {
                fontSize: "14px",
              },
            }}
          >
            Comparison View
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default SingleSearchbar;
