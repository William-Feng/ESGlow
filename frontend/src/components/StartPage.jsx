import { CssBaseline, Grid, Paper, ThemeProvider, createTheme } from '@mui/material';
import React from 'react'
import Login from './Login'
import Register from './Register';
import ResetInputEmail from './ResetInputEmail';

export default function StartPage({ page, onSuccess }) {
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
          { page === 'login' && <Login onSuccess={onSuccess} />  }
          { page === 'register' && <Register onSuccess={onSuccess} />}
        </Grid>
      </Grid>
    </ThemeProvider>
    );
}
