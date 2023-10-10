import React from 'react'
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetInputEmail({ setter }) {
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();
  
  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const submitEmail = async () => {

    if (email.length === 0) {
      return setErrorMessage('Please enter your email');
    }

    const response = await fetch('/api/password-reset-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email
      })
    });

    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      setter(email);
      navigate('/resetPassword/verify')
    } else {
      return setErrorMessage(data.message);
    }
  }

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
    <Box sx={{ margin: 5, textAlign: 'center' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal:  'center' }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error">{errorMessage}</Alert>
      </Snackbar>
      <Typography variant="h2">
      Forgot Password?
      </Typography>
      <Typography variant="subtitle1" >
        Enter the email associated with your account, and we'll send you a code to reset your password.
      </Typography>
    </Box>
    <Box component="form" noValidate sx={{ mt: 1 }}>
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
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={(e) => (submitEmail(e.target.value))}
      >
        Next
      </Button>
    </Box>
  </Box>
  )
}
