import {
  Autocomplete,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { SingleModeContext } from "./SingleMode";
import { useCompanyData } from "../../../hooks/UseCompanyData";
import useIndustryData from "../../../hooks/UseIndustryData";
import { toggleButtonStyle } from "../../../styles/componentStyle";
import {
  searchBarBoxStyle,
  searchBarStyle,
} from "../../../styles/componentStyle";

function SingleSearchbar({ token }) {
  const {
    selectedIndustry,
    setSelectedIndustry,
    selectedCompany,
    setSelectedCompany,
    mode,
    setMode,
  } = useContext(SingleModeContext);

  const { industryList } = useIndustryData(token, null, null);
  const companyList = useCompanyData(selectedIndustry, token);

  return (
    <Box sx={searchBarBoxStyle}>
      <Autocomplete
        disablePortal
        onChange={(_, i) => {
          setSelectedIndustry(i || null);
          setSelectedCompany(null);
        }}
        options={industryList}
        sx={searchBarStyle}
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
          ...searchBarStyle,
          backgroundColor: selectedIndustry ? "white" : "#E8E8E8",
        }}
        renderInput={(params) => <TextField {...params} label="Company" />}
      />
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e) => setMode(e.currentTarget.value)}
        aria-label="company mode"
        sx={{
          backgroundColor: "white",
        }}
      >
        <ToggleButton
          value="single"
          sx={{
            backgroundColor: mode === "single" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography variant="body4" textAlign="center" sx={toggleButtonStyle}>
            Single Mode
          </Typography>
        </ToggleButton>
        <ToggleButton
          value="multiple"
          sx={{
            backgroundColor: mode === "multiple" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography variant="body4" textAlign="center" sx={toggleButtonStyle}>
            Comparison Mode
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default SingleSearchbar;
