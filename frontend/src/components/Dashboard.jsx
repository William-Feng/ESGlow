import { AppBar, Box, CssBaseline, Drawer, ThemeProvider, Toolbar, createTheme } from '@mui/material'
import React from 'react'
import Header from './Header';
import Searchbar from './Searchbar';
import SelectionSidebar from './SelectionSidebar';

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
        <Box
          sx={{ position: 'fixed', top: '128px', width: '100%' }}
        >
          <Box
            sx={{ border: 'dotted', margin: '0', textAlign: 'center', height: '200px' }}
          >
            {/* should also have company overview */}
            Company Overview is here.
          </Box>
          <Box>
            <Drawer
              sx={{
                position: 'static',
                width: 240,
                flexShrink: 0,
                top: '328px',
                '& .MuiDrawer-paper': {
                  width: 240,
                  boxSizing: 'border-box',
                },
              }}
              variant="permanent"
              anchor="left"
            >
             <SelectionSidebar />
            </Drawer>
            
            {/* table */}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
