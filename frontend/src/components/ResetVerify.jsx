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

export default function ResetVerify({ email }) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const submitVerificationCode = async () => {
    if (code.length === 0) {
      return setErrorMessage("Please enter verification code");
    }

    const response = await fetch("/api/password-reset/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      navigate("/resetPassword/setNewPassword");
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
        Verify Your Code
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
          submitVerificationCode();
        }}
      >
        <Typography
          variant="subtitle1"
          color="textSecondary"
          mb={2}
          textAlign="center"
        >
          Enter the verification code sent to {email}.
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="code"
          label="Verification Code"
          name="code"
          autoComplete="code"
          autoFocus
          onChange={(e) => setCode(e.target.value)}
          variant="standard"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Verify
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
            Go back to{" "}
            <Link href="/" color="primary" underline="hover">
              login page
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
