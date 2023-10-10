import { Box, Button, Grid, Link, TextField, Typography, createTheme } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
function Login () {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");

  const defaultTheme = createTheme();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
=======
function Login ({ onSuccess }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.length === 0 || password.length === 0) {
      return setErrorMessage('Please enter your details');
    }

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      onSuccess(data.token);
      navigate('/dashboard');
    } else {
      return setErrorMessage(data.message);
    }
>>>>>>> main
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Welcome
      </Typography>
      <Typography component="h1" variant="h2">
        Login
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
        />
        <Grid item xs>
          <Link href="/resetPassword" variant="body2">
            Forgot your password?
          </Link>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Log In
        </Button>
        <Grid item>
          <Link href="/register" variant="body2">
            Don't have an account? Register here
          </Link>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;