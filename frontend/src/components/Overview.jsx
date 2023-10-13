import { Box, Container, Typography } from '@mui/material';
import React from 'react';

export default function Overview() {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        mx: 'auto',
        width: '90%',
      }}
    >
      <Typography
        component='h1'
        variant='h2'
        color='text.primary'
        gutterBottom
        textAlign='center'
      >
        Company Name
      </Typography>
      <Container
        sx={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant='h5' color='text.secondary' paragraph>
            Summary of company's ESG reporting...
          </Typography>
        </Box>
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h1>50</h1>
            <h3>ESG Rating</h3>
          </Box>
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h2>43</h2>
            <h4>Industry Mean</h4>
            <h2>24/185</h2>
            <h4>Industry Ranking</h4>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant='h5' color='text.secondary' paragraph textAlign='center'>
            Chart
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}