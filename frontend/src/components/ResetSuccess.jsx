import React from 'react'
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetSuccess({ remover }) {
  const navigate = useNavigate();

  function handleResetSuccess () {
    remover('email');
    navigate('/');
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
      <Typography variant="h3">
      Successful Password Reset!
      </Typography>
      <Typography variant="subtitle1" >
        You can now use your new password to log in to your account.
      </Typography>
    </Box>
    <Box noValidate sx={{ mt: 1 }}>
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={() => handleResetSuccess()}
      >
        Login
      </Button>
    </Box>
  </Box>
  )
}