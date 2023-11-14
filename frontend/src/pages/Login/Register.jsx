import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SnackBarManager from "../Dashboard/Components/Misc/SnackBarManager";
import { landingPageBoxStyle } from "../../styles/componentStyle";

function Register({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegExp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (name.length < 3) {
      return setErrorMessage("Name must be at least 3 characters");
    } else if (email.length === 0 || !emailRegExp.test(email)) {
      return setErrorMessage("Invalid email address");
    } else if (password.length < 3 || password.length > 50) {
      return setErrorMessage("Password must be between 3 and 50 characters");
    } else if (confirmPassword !== password) {
      return setErrorMessage("Passwords do not match");
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (response.status === 200) {
        onSuccess(data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error with POST request for /api/register", error);
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  return (
    <Box
      sx={landingPageBoxStyle}
    >
      <SnackBarManager
        position={"top"}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
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
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          onChange={(e) => setName(e.target.value)}
          variant="standard"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
