import { AppBar, Box, CssBaseline, ThemeProvider, Toolbar, createTheme } from '@mui/material'
import React from 'react'
import Header from './Header';
import Searchbar from './Searchbar';

function Dashboard ({ token }) {
  const defaultTheme = createTheme();
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position='fixed'
          color='inherit'
          elevation={0}
          sx={{
            bgcolor: 'primary.main',
            height: 128,
            margin: ''
          }}
        >
          <Toolbar>
            <Header />
          </Toolbar>
          <Toolbar sx={{margin: 'auto'}}>
            <Searchbar/>
          </Toolbar>
        </AppBar>
        {/* should also have company overview */}
        {/* sidebar */}
        {/* table */}
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
