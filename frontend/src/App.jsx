// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/Register'
import Login from './components/Login';
import CssBaseLine from '@mui/material/CssBaseline'

function App() {
  	return (
		<BrowserRouter >
		<CssBaseLine />
			<Routes>
				<Route exact path="/" element={<Login />} /> {/* change to login */}
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
  );
}

export default App;
