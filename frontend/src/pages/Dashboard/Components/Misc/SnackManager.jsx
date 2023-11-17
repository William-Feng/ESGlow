import React from "react";
import { Snackbar, Alert } from "@mui/material";

function SnackbarManager({
  position,
  successMessage,
  setSuccessMessage,
  errorMessage,
  setErrorMessage,
}) {
  const handleCloseSnackbar = () => {
    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  return (
    <>
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: position, horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}
      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: position, horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default SnackbarManager;
