import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export default function ToggleDataView({ disabled, setDataView, dataView }) {
  return (
    <>
      <Box
        sx={{
          backgroundColor:
            !disabled ? "transparent" : "#D7D7D7",
          textAlign: "center",
          p: "15px",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <ToggleButtonGroup
          value={dataView}
          exclusive
          disabled={disabled}
          onChange={(e) => setDataView(e.currentTarget.value)}
          aria-label='table view'
          sx={{
            backgroundColor: "#E8E8E8",
            m: "auto",
          }}
        >
          <ToggleButton
            value='table'
            sx={{
              backgroundColor: dataView === "table" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography variant='body4'>Table View</Typography>
          </ToggleButton>
          <ToggleButton
            value='other'
            sx={{
              backgroundColor: dataView === "other" ? "#B0C4DE !important" : "",
            }}
          >
            <Typography variant='body4'>Graph View</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  )
}
