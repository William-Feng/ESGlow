import {
  Autocomplete,
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SingleViewContext } from "./SingleView";

function SingleViewSearchbar({ token }) {
  const {
    selectedIndustry,
    setSelectedIndustry,
    selectedCompany,
    setSelectedCompany,
    view,
    setView,
  } = useContext(SingleViewContext);

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
          <Typography
            variant="body4"
            textAlign="center"
            sx={{
              fontSize: "14px", // Default font size
              "@media (min-width: 768px)": {
                fontSize: "10px", // Adjust font size for screens wider than 768px
              },
              "@media (min-width: 1024px)": {
                fontSize: "14px", // Adjust font size for screens wider than 1024px
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

export default SingleViewSearchbar;
