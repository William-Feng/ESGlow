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

export default function Searchbar({ token, setIndustry, setCompany }) {
  const [view, setView] = useState("single");
  const handleView = (_, newView) => {
    setView(newView);
  };

  const [industryList, setIndustryList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    fetch("/api/industries/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIndustryList(data.industries);
      })
      .catch((error) =>
        console.error(
          "There was an error fetching the industry information.",
          error
        )
      );
  }, [token]);

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
        onChange={(_, i) => {
          setIndustry(i || null);
        }}
        options={industryList}
        sx={{
          width: "300px",
          backgroundColor: "#E8E8E8",
          borderRadius: 1,
        }}
        renderInput={(params) => <TextField {...params} label="Industry" />}
      />
      <Autocomplete
        disablePortal
        onChange={(_, c) => {
          setCompany(companyList.find((company) => company.name === c) || null);
        }}
        options={companyList.map((c) => c.name)}
        sx={{
          width: "300px",
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
