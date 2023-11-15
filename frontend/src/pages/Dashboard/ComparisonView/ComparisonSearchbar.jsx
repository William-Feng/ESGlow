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
import { useContext } from "react";
import { ComparisonViewContext } from "./ComparisonView";
import { searchBarBoxStyle, searchBarStyle, toggleButtonStyle } from "../../../styles/componentStyle";
import { useCompanyList } from "../../../hooks/UseCompanyData";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Max Selection can be changed by variable below
const maxSelection = 3;

function ComparisonSearchbar({ token }) {
  const { selectedCompanies, setSelectedCompanies, view, setView } = useContext(
    ComparisonViewContext
  );

  const isMaxSelectionReached = selectedCompanies.length >= maxSelection;
  const companyList = useCompanyList(token);

  return (
    <Box
      sx={searchBarBoxStyle}
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
        sx={searchBarStyle}
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
            sx={toggleButtonStyle}
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
            sx={toggleButtonStyle}
          >
            Comparison View
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default ComparisonSearchbar;
