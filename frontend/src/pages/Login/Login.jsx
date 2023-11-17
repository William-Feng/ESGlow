import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SnackbarManager from "../Dashboard/Components/Misc/SnackbarManager";
import { landingPageBoxStyle } from "../../styles/ComponentStyle";
import { landingPageLinkFont } from "../../styles/FontStyle";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.length === 0 || password.length === 0) {
      return setErrorMessage("Please enter your details");
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
    <Box sx={landingPageBoxStyle}>
      <SnackbarManager
        position={"top"}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={3}>
        Log in to access your dashboard
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          width: "90%",
          maxWidth: "420px",
          p: 2,
        }}
      >
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          variant="standard"
          sx={{ height: "2em" }}
        />
        <Box mt={4}>
          <Link
            href="/reset-password"
            variant="body2"
            color="textSecondary"
            sx={landingPageLinkFont}
          >
            Forgot password?
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2, maxHeight: "10vh" }}
        >
          Log In
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body1" color="textSecondary">
            Don't have an account? <br />
            <Link
              href="/register"
              color="primary"
              underline="hover"
              sx={landingPageLinkFont}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
