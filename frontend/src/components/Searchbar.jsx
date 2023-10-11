import { IconButton, InputBase, Paper, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

export default function Searchbar() {
  
  const [view, setView] = React.useState('single');

  const handleView = (event, newView) => {
    setView(newView);
  };

  return (
    <>
      {/* <Box
        sx={{ display: 'flex', flexDirection: 'row', textAlign: 'center' }}
      > */}
        <Paper
          component='form'
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <IconButton sx={{ p: '10px' }} aria-label='menu'>
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex:1 }}
            placeholder='Select a company'
            inputProps={{ 'aria-label': 'select a company' }}
          />
        </Paper>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleView}
          aria-label='company view'
        >
          <ToggleButton value='single'>
            <Typography>Single Company View</Typography>
          </ToggleButton>
          <ToggleButton value='multiple'>
            <Typography>Comparison View</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      {/* </Box> */}
    </>
  )
}
