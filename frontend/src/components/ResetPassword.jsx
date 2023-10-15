import React from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword({ email }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const submitNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setErrorMessage("Passwords do not match");
    } else if (newPassword.length < 3 || newPassword.length > 50) {
      return setErrorMessage("Password must be between 3 and 50 characters");
    }

    const response = await fetch("/api/password-reset/change", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        new_password: newPassword,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      navigate("/resetPassword/success");
    } else {
      return setErrorMessage(data.message);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ margin: 5, textAlign: "center" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        <Typography variant="h3">Set New Password</Typography>
        <Typography variant="subtitle1">Enter your new password.</Typography>
      </Box>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="New Password"
          type="password"
          name="password"
          autoComplete="password"
          autoFocus
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirm-password"
          label="Confirm New Password"
          type="password"
          name="confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => submitNewPassword()}
        >
          Next
        </Button>

        <Grid item xs>
          <Link href="/" variant="body2">
            Return to home screen
          </Link>
        </Grid>
      </Box>
    </Box>
  );
}
