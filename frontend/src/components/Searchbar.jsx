import {
  Autocomplete,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";

export default function Searchbar({ token, setCompany }) {
  const [view, setView] = useState("single");
  const [companyList, setCompanyList] = useState([]);

  const handleView = (_, newView) => {
    setView(newView);
  };

  useEffect(() => {
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
        id="combo-box-demo"
        onChange={(_, selectedName) => {
          selectedName ? setCompany(companyList.find(company => company.name === selectedName))
                        : setCompany(null);
        }}
        options={ companyList.map(c => c.name) }
        sx={{
          width: "400px",
          backgroundColor: "#E8E8E8",
          borderRadius: 1,
        }}
        renderInput={(params) => <TextField {...params} label="Company" />}
      />
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleView}
        aria-label="company view"
        sx={{
          backgroundColor: "#E8E8E8",
        }}
      >
        <ToggleButton
          value="single"
          sx={{
            backgroundColor: view === "single" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography>Single Company View</Typography>
        </ToggleButton>
        <ToggleButton
          value="multiple"
          sx={{
            backgroundColor: view === "multiple" ? "#B0C4DE !important" : "",
          }}
        >
          <Typography>Comparison View</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
