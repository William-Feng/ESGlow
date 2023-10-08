import { Alert, Box, Button, CssBaseline, Grid, Link, Paper, Snackbar, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import React from 'react'

function Register () {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [openEmailError, setOpenEmailError] = React.useState("");
  const [openShortPassError, setOpenShortPassError] = React.useState("");
  const [openLongPassError, setOpenLongPassError] = React.useState("");
  const [openMismatchPassError, setOpenMismatchPassError] = React.useState("");

  const defaultTheme = createTheme();
  const handleEmailErrOpen = () => {
    setOpenEmailError(true);
  }
  const handleEmailErrClose = () => {
    setOpenEmailError(false);
  };
  const handleShortPassErrOpen = () => {
    setOpenShortPassError(true);
  }
  const handleShortPassErrClose = () => {
    setOpenShortPassError(false);
  };
  const handleLongPassErrOpen = () => {
    setOpenLongPassError(true);
  }
  const handleLongPassErrClose = () => {
    setOpenLongPassError(false);
  };
  const handleMismatchPassErrOpen = () => {
    setOpenMismatchPassError(true);
  }
  const handleMismatchPassErrClose = () => {
    setOpenMismatchPassError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.length === 0 || !emailRegExp.test(email)) {
      return handleEmailErrOpen();
    } else if (password.length < 3) {
      return handleShortPassErrOpen();
    } else if (password.length > 50) {
      return handleLongPassErrOpen();
    } else if (confirmPass !== password) {
      return handleMismatchPassErrOpen();
    }
    console.log({
      email: email,
      password: password,
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Snackbar 
        anchorOrigin={{ vertical:"top", horizontal:"center" }} 
        open={openEmailError} 
        autoHideDuration={6000} 
        onClose={handleEmailErrClose}
      >
        <Alert severity="error">Invalid email address</Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{ vertical:"top", horizontal:"center" }} 
        open={openShortPassError} 
        autoHideDuration={6000} 
        onClose={handleShortPassErrClose}
      >
        <Alert severity="error">Password is too short</Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{ vertical:"top", horizontal:"center" }} 
        open={openLongPassError} 
        autoHideDuration={6000} 
        onClose={handleLongPassErrClose}
      >
        <Alert severity="error">Password is too long</Alert>
      </Snackbar>
      <Snackbar 
        anchorOrigin={{ vertical:"top", horizontal:"center" }} 
        open={openMismatchPassError} 
        autoHideDuration={6000} 
        onClose={handleMismatchPassErrClose}
      >
        <Alert severity="error">Passwords do not match</Alert>
      </Snackbar>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                onChange={e => setConfirmPass(e.target.value)}
              />
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot your password?
                </Link>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Log in here
                </Link>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Register;