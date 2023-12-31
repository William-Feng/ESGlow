import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SnackbarManager from "../../Dashboard/Components/Misc/SnackbarManager";
import { landingPageBoxStyle } from "../../../styles/ComponentStyle";

function ResetInputEmail({ setter }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitEmail = async () => {
    setLoading(true);
    if (email.length === 0) {
      setErrorMessage("Please enter your email");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/password-reset/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();
    setLoading(false);
    if (response.status === 200) {
      setter(email);
      navigate("/reset-password/verify");
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <Box sx={landingPageBoxStyle}>
      <SnackbarManager
        position={"top"}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <Typography variant="h4" gutterBottom>
        Forgot Password?
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
          submitEmail();
        }}
      >
        <Typography
          variant="subtitle1"
          color="textSecondary"
          mb={2}
          textAlign="center"
        >
          Enter the email associated with your account, and we'll send you a
          code to reset your password.
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          variant="standard"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Next"}
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Remember your password?{" "}
            <Link href="/" color="primary" underline="hover">
              Return to login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ResetInputEmail;
