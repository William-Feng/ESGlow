import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  // const [email, setEmail] = React.useState('');


  // function submitEmail () {
  //   navigate('/resetPassword/verify');
  // }

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
      <Typography component="h1" variant="h3">
      Forgot Password?
      </Typography>
      <Typography component="subtitle2" >
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
      />

      <Button
        // type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={ () => navigate('/resetPassword/verify') }
      >
        Next
      </Button>
    </Box>
  </Box>
  )
}
