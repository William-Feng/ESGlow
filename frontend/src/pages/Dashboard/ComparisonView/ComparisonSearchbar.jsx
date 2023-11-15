import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useEffect, useState, useContext } from "react";
import { ComparisonViewContext } from "./ComparisonView";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Max Selection can be changed by variable below
const maxSelection = 3;

function ComparisonSearchbar({ token }) {
  const { selectedCompanies, setSelectedCompanies, view, setView } = useContext(
    ComparisonViewContext
  );

  const [companyList, setCompanyList] = useState([]);

  const isMaxSelectionReached = selectedCompanies.length >= maxSelection;

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
      .catch((error) => {
        if (error !== "No companies found") {
          console.error(
            "There was an error fetching the company information.",
            error
          );
        }
      });
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
        onChange={(_, c) => {
          setSelectedCompanies(c);
        }}
        multiple
        limitTags={1}
        options={companyList}
        disableCloseOnSelect
        getOptionLabel={(company) => company.name}
        renderOption={(props, company, { selected }) => (
          // eslint-disable-next-line
          <li {...props} aria-disabled={!selected && isMaxSelectionReached}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {company.name}
          </li>
        )}
        noOptionsText={"No options available"}
        sx={{
          width: "340px",
          backgroundColor: "white",
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

export default ComparisonSearchbar;
