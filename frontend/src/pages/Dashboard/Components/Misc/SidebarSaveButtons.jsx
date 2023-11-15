import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
} from "@mui/material";

function SidebarSaveButtons({
  selectedFramework,
  selectedAdditionalIndicators,
  handleSaveFrameworkDialogToggle,
  saveFrameworkDialogOpen,
  customFrameworkName,
  handleCustomFrameworkNameChange,
  customFrameworkDescription,
  handleCustomFrameworkDescriptionChange,
  handleSaveFramework,
  handleUpdateSelections,
}) {
  if (!(selectedFramework || selectedAdditionalIndicators.length > 0)) {
    return null;
  }
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: 2,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSaveFrameworkDialogToggle}
        sx={{
          width: "150px",
          height: "55px",
          whiteSpace: "normal",
          textAlign: "center",
        }}
      >
        Save Custom Framework
      </Button>

      <Dialog
        open={saveFrameworkDialogOpen}
        onClose={handleSaveFrameworkDialogToggle}
      >
        <DialogTitle>Save Custom Framework</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name and description for your custom framework.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="customFrameworkName"
            label="Unique Custom Framework Name"
            type="text"
            fullWidth
            required
            variant="standard"
            value={customFrameworkName}
            onChange={handleCustomFrameworkNameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveFramework();
              }
            }}
          />
          <TextField
            margin="dense"
            id="customFrameworkDescription"
            label="Description (Optional)"
            type="text"
            fullWidth
            variant="standard"
            value={customFrameworkDescription}
            onChange={handleCustomFrameworkDescriptionChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveFramework();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveFrameworkDialogToggle}>Cancel</Button>
          <Button onClick={handleSaveFramework}>Save</Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateSelections}
        sx={{
          width: "150px",
          height: "55px",
          whiteSpace: "normal",
          textAlign: "center",
        }}
      >
        Update Score
      </Button>
    </Box>
  );
}

export default SidebarSaveButtons;
