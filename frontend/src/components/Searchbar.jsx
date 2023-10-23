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

export default function Searchbar({
  token,
  selectedIndustry,
  setSelectedIndustry,
  selectedCompany,
  setSelectedCompany,
}) {
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
    // Once an industry has been selected, fetch the companies for that industry
    if (selectedIndustry) {
      fetch(`/api/industries/${selectedIndustry}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Halt the chain if there are no companies for the selected industry
          if (data.companies.length === 0) {
            setCompanyList([]);
            return Promise.reject("No companies found for selected industry");
          }
          const companyIds = data.companies.join(",");
          // Fetch the company information
          return fetch(`/api/companies/${companyIds}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((response) => response.json())
        .then((data) => {
          setCompanyList(data.companies);
        })
        .catch((error) => {
          if (error !== "No companies found for the selected industry") {
            console.error(
              "There was an error fetching the company information.",
              error
            );
          }
        });
    } else {
      // Reset to null if no industry is selected
      setCompanyList([]);
    }
  }, [selectedIndustry, token]);

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
          setCompanyList([]);
          setSelectedCompany(null);
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
