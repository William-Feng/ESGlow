import { CssBaseline, Grid, Paper, ThemeProvider, createTheme } from '@mui/material';
import React from 'react'
import ResetInputEmail from './ResetInputEmail';
import ResetVerify from './ResetVerify';
import ResetPassword from './ResetPassword';
import ResetSuccess from './ResetSuccess';

export default function ResetMain({ page }) {
  const defaultTheme = createTheme();
  const [email, setEmail] = React.useState(localStorage.getItem('email'))
  
  function setUserEmail (email) {
    setEmail(email);
    localStorage.setItem('email', email);
  }
  function removeUserEmail () {
    localStorage.removeItem('email');
  }

  return (
    <ThemeProvider theme={defaultTheme}>
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
          { page === 'resetMain' && <ResetInputEmail setter={setUserEmail}/>  }
          { page === 'resetVerify' && <ResetVerify email={email}/> }
          { page === 'resetNewPW' && <ResetPassword email={email}/> }
          { page === 'resetSuccess' && <ResetSuccess remover={removeUserEmail}/> }
        </Grid>
      </Grid>
    </ThemeProvider>
    );
}
