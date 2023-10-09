// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseLine from '@mui/material/CssBaseline'
import StartPage from './components/StartPage';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  
  function manageTokenSet (token) {
    setToken(token);
    localStorage.getItem('token', token);
  }

  return (
    <BrowserRouter >
    <CssBaseLine />
      <Routes>
        <Route exact path="/" element={<StartPage page={ 'login' } onSuccess={manageTokenSet} />} />
        <Route path="/register" element={<StartPage page={ 'register' }/>} />
        <Route path="/resetPassword" element={<StartPage page={ 'reset' }/>} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
