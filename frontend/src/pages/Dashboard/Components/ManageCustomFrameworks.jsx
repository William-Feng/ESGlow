import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Button,
  DialogActions,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ManageCustomFrameworks({ open, onClose, token }) {
  const [customFrameworks, setCustomFrameworks] = useState([]);

  useEffect(() => {
    if (open) {
      // Fetch custom frameworks when the dialog opens
      fetch("/api/custom-frameworks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setCustomFrameworks(data.custom_frameworks))
        .catch((error) =>
          console.error("Error fetching custom frameworks", error)
        );
    }
  }, [open, token]);

  const handleDeleteFramework = (frameworkId) => {
    // Send DELETE request to server
    fetch(`/api/custom-frameworks/${frameworkId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // Update state to reflect deleted framework
          setCustomFrameworks(
            customFrameworks.filter((f) => f.framework_id !== frameworkId)
          );
        } else {
          console.error("Failed to delete framework");
        }
      })
      .catch((error) => console.error("Error deleting framework", error));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Created Custom Frameworks</DialogTitle>
      <List>
        {customFrameworks.length > 0 ? (
          customFrameworks.map((framework) => (
            <ListItem
              key={framework.framework_id}
              sx={{
                margin: 1,
                padding: 2,
                borderRadius: 1,
                boxShadow: 1,
                "&:hover": {
                  boxShadow: 3,
                },
                backgroundColor: "background.paper",
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h6">
                    {framework.framework_name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {framework.description}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Delete Framework">
                  <IconButton
                    edge="end"
                    color="secondary"
                    onClick={() =>
                      handleDeleteFramework(framework.framework_id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <Box sx={{ padding: 3 }}>
            <Typography color="text.secondary" mb={3}>
              No custom frameworks have been created yet.
            </Typography>
            <Typography color="text.secondary">
              Personalise your experience by selecting your desired indicators
              and weights from the sidebar!
            </Typography>
          </Box>
        )}
      </List>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ManageCustomFrameworks;
