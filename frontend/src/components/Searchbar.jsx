import {
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import React from "react";

export default function Searchbar() {
  const [view, setView] = useState("single");

  const handleView = (event, newView) => {
    setView(newView);
  };

  // const searchCompany = async (e) => {
  //   e.preventDefault();

  //   if (email.length === 0 || password.length === 0) {
  //     return setErrorMessage("Please enter your details");
  //   }

  //   const response = await fetch("/api/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //     body: JSON.stringify({
  //       email,
  //       password,
  //     }),
  //   });
  //   console.log(response);
  //   const data = await response.json();
  //   console.log(data);
  //   if (response.status === 200) {
  //     onSuccess(data.token);
  //     navigate("/dashboard");
  //   } else {
  //     return setErrorMessage(data.message);
  //   }
  // };

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={ ['.'] }
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
