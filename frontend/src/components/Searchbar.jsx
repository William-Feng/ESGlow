import {
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import React from "react";

export default function Searchbar({token}) {
  const [view, setView] = useState("single");
  const [companyList, setCompanyList] = useState([]);

  const handleView = (event, newView) => {
    setView(newView);
  };

  React.useEffect(() => {
    fetch("/api/companies/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setCompanyList(data.companies);
    })
    .catch((error) =>
      console.error(
        "There was an error fetching the company information.",
        error
      )
    );
  }, [token]);

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={ companyList }
        sx={{ width: 300, backgroundColor: 'white' }}
        renderInput={(params) => <TextField
          {...params} label="Company"
        />}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleView}
        aria-label="company view"
      >
        <ToggleButton value="single">
          <Typography>Single Company View</Typography>
        </ToggleButton>
        <ToggleButton value="multiple">
          <Typography>Comparison View</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
