import { Alert, Box, Button, Grid, Link, Snackbar, TextField, Typography } from '@mui/material';
import React from 'react'

function Login () {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      setErrorMessage('Please enter your details')
    }
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal:  'center' }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
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
          onChange={e => setEmail(e.target.value)}
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
          onChange={e => setPassword(e.target.value)}
        />
        <Grid item xs>
          <Link href="/resetpassword" variant="body2">
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