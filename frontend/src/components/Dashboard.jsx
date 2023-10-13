import { AppBar, Box, CssBaseline, Drawer, ThemeProvider, Toolbar, createTheme } from '@mui/material'
import React from 'react'
import Header from './Header';
import Searchbar from './Searchbar';
import Overview from './Overview';
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
            margin: '',
            zIndex: (theme) => theme.zIndex.drawer + 1
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
          sx={{ position: 'fixed', top: '128px', width: '100%', minHeight: '100vh', maxHeight: '600px' }}
        >
          <Box
            sx={{ border: 'dotted', margin: '0', textAlign: 'center', maxHeight: '450px' }}
          >
            <Overview />
          </Box>
          <Box sx={{ height: '900px', overflowY: 'scroll' }}>
            <Drawer
              sx={{
                position: 'relative',
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: 240,
                  top: '540px',
                  boxSizing: 'border-box',
                  overflowY: 'scroll',
                  maxHeight: 'calc(100vh - 570px)',
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
