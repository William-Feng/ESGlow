import React from "react";
import {
  Alert,
  Box,
  Button,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword({ email }) {
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
      <Typography variant="h4" gutterBottom>
        Set New Password
      </Typography>

      <Box
        component="form"
        noValidate
        sx={{
          width: "90%",
          maxWidth: "420px",
          p: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          submitNewPassword();
        }}
      >
        <Typography
          variant="subtitle1"
          color="textSecondary"
          mb={2}
          textAlign="center"
        >
          Enter your new password below.
        </Typography>

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
          variant="standard"
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
          variant="standard"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Confirm
        </Button>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Remembered your password?{" "}
            <Link href="/" color="primary" underline="hover">
              Return to login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ResetPassword;
