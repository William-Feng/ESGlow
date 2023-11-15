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
    view,
    setView,
  } = useContext(SingleViewContext);

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
        renderInput={(params) => <TextField {...params} label='Industry' />}
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
        renderInput={(params) => <TextField {...params} label='Company' />}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e) => setView(e.currentTarget.value)}
        aria-label='company view'
        sx={{
          backgroundColor: "white",
        }}
      >
        <ToggleButton
          value='single'
          sx={{
            backgroundColor: view === "single" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography variant='body4' textAlign='center' sx={toggleButtonStyle}>
            Single View
          </Typography>
        </ToggleButton>
        <ToggleButton
          value='multiple'
          sx={{
            backgroundColor: view === "multiple" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography variant='body4' textAlign='center' sx={toggleButtonStyle}>
            Comparison View
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default SingleSearchbar;
