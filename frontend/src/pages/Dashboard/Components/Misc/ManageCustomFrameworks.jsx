import React, { useState } from "react";
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
import SnackBarManager from "./SnackBarManager";
import useCustomFrameworksData from "../../../../hooks/UseCustomFrameworksData";

function ManageCustomFrameworks({ open, onClose, token }) {
  const { customFrameworks, deleteCustomFramework } = useCustomFrameworksData(
    token,
    open,
    false
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeleteFramework = async (frameworkId) => {
    const { success } = await deleteCustomFramework(frameworkId);
    if (success) {
      setSuccessMessage("Framework deleted successfully.");
    }
  };

  return (
    <Dialog open={open || false} onClose={onClose} fullWidth maxWidth="sm">
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
      <SnackBarManager
        position={"bottom"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </Dialog>
  );
}

export default ManageCustomFrameworks;
