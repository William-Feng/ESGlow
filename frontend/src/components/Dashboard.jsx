import { AppBar, Box, CssBaseline, ThemeProvider, Toolbar, createTheme } from '@mui/material'
import React from 'react'
import Header from './Header';

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
          }}
        >
          <Toolbar>
            <Header />
          </Toolbar>
        </AppBar>
        {/* sidebar */}
        {/* table */}
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
