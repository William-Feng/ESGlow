import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseLine from '@mui/material/CssBaseline'
import StartPage from './components/StartPage';

function App() {
  return (
    <BrowserRouter >
    <CssBaseLine />
      <Routes>
        <Route exact path="/" element={<StartPage page={ 'login' }/>} />
        <Route path="/register" element={<StartPage page={ 'register' }/>} />
        <Route path="/resetPassword" element={<StartPage page={ 'reset' }/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
