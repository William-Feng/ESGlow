import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword ({ email }) {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const navigate = useNavigate();

  function submitNewPassword () {
    // async to backend to set new password
    // navigate to success page
    navigate('/resetPassword/success');
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
      <Typography component="h1" variant="h3">
      Set New Password
      </Typography>
      <Typography component="subtitle2" >
        Enter the new password.
      </Typography>
    </Box>
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="New Password"
        name="password"
        autoComplete="password"
        autoFocus
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirm-password"
        label="Confirm New Password"
        name="confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => submitNewPassword()}
      >
        Next
      </Button>
    </Box>
  </Box>
  )
}
