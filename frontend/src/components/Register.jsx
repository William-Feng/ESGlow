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

function Register({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
      <Typography variant="h4" gutterBottom>
        Create Your Account!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={4}>
        Enter your details to get started
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
          autoComplete="new-password"
          onChange={(e) => setPassword(e.target.value)}
          variant="standard"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          onChange={(e) => setConfirmPass(e.target.value)}
          variant="standard"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Already have an account?{" "}
            <Link href="/" color="primary" underline="hover">
              Log in here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
