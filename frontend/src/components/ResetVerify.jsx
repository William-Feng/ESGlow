import React from 'react'
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetVerify({ email }) {
  const [code, setCode] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setErrorMessage("");
  };

  const submitVerificationCode = async () => {
    if (code.length === 0) {
      return setErrorMessage('Please enter verification code');
    }

    const response = await fetch('/api/password-reset-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        code
      })
    });

    const data = await response.json();
    if (response.status === 200) {
      navigate('/resetPassword/setNewPassword')
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
        Put in the verification code sent to you at {email}.
      </Typography>
    </Box>
    <Box component="form" noValidate sx={{ mt: 1 }}>
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
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={(e) => (submitVerificationCode(e.target.value))}
      >
        Next
      </Button>
    </Box>
  </Box>
  )
}