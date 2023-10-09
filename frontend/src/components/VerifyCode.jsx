import React from 'react'
import { Box, Button, TextField, Typography } from '@mui/material';


export default function VerifyCode() {
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
        Put in the verification code sent to you at [insert email].
      </Typography>
    </Box>
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="vcode"
        label="Verification Code"
        name="vcode"
        autoFocus
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Next
      </Button>
    </Box>
  </Box>
  )
}
