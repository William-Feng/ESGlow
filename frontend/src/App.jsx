import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseLine from '@mui/material/CssBaseline'
import StartPage from './components/StartPage';
import ResetMain from './components/ResetMain';

function App() {


  return (
    <BrowserRouter >
    <CssBaseLine />
      <Routes>
        <Route exact path="/" element={<StartPage page={ 'login' }/>} />
        <Route path="/register" element={<StartPage page={ 'register' }/>} />
        
        <Route path="/resetPassword" element={<ResetMain page={ 'resetMain' }/>} />
        <Route path="/resetPassword/verify" element={<ResetMain page={ 'resetVerify' }/>} />
        <Route path="/resetPassword/setNewPassword" element={<ResetMain page={ 'resetNewPW' }/>} />
        <Route path="/resetPassword/success" element={<ResetMain page={ 'resetSuccess' }/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
