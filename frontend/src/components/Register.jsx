<<<<<<< HEAD
import { Box, Button, Grid, Link, TextField, Typography, createTheme } from '@mui/material';
import React from 'react'
=======
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
import React from "react";
import { useNavigate } from "react-router-dom";
// import logoBlack from '../assets/logo-black.png'
>>>>>>> main

function Register({ onSuccess }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.length === 0 || !emailRegExp.test(email)) {
      return setErrorMessage("Invalid email address");
    } else if (password.length < 3 || password.length > 50) {
      return setErrorMessage("Password must be between 3 and 50 characters");
    } else if (confirmPass !== password) {
      return setErrorMessage("Passwords do not match");
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      onSuccess(data.token);
      navigate("/dashboard");
    } else {
      return setErrorMessage(data.message);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
<<<<<<< HEAD
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
=======
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
>>>>>>> main
      <Typography component="h1" variant="h5">
        Welcome
      </Typography>
      <Typography component="h1" variant="h2">
        Register
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
<<<<<<< HEAD
          onChange={e => setEmail(e.target.value)}
=======
          onChange={(e) => setEmail(e.target.value)}
>>>>>>> main
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
<<<<<<< HEAD
          onChange={e => setPassword(e.target.value)}
=======
          onChange={(e) => setPassword(e.target.value)}
>>>>>>> main
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="current-password"
<<<<<<< HEAD
          onChange={e => setConfirmPass(e.target.value)}
=======
          onChange={(e) => setConfirmPass(e.target.value)}
>>>>>>> main
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid item>
          <Link href="/" variant="body2">
            Already have an account? Log in here
          </Link>
        </Grid>
      </Box>
    </Box>
  );
}

export default Register;
