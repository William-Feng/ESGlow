import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import ResetVerify from './ResetVerify';

export default function ResetPassword() {
  const [email, setEmail] = React.useState("");
  const [isRequested, setIsRequested] = React.useState(false);


  // const navigate = useNavigate();
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
    {isRequested ? 
      <ResetVerify email={ email }/>
      :
      <>
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
            onChange={e => setEmail(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={ () => setIsRequested(true) }
          >
            Next
          </Button>
        </Box>
      </>
      }
  </Box>
  )
}
