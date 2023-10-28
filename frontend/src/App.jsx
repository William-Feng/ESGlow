import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import CssBaseLine from "@mui/material/CssBaseline";
import StartPage from "./pages/Login/StartPage";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function manageTokenSet(token) {
    setToken(token);
    localStorage.setItem("token", token);
  }

  return (
    <BrowserRouter>
      <CssBaseLine />
      <Routes>
        <Route
          exact
          path="/"
          element={<StartPage page={"login"} onSuccess={manageTokenSet} />}
        />
        <Route
          path="/register"
          element={<StartPage page={"register"} onSuccess={manageTokenSet} />}
        />
        <Route
          path="/resetPassword"
          element={<StartPage page={"resetPassword"} />}
        />
        <Route
          path="/resetPassword/verify"
          element={<StartPage page={"resetVerify"} />}
        />
        <Route
          path="/resetPassword/setNewPassword"
          element={<StartPage page={"resetNewPW"} />}
        />
        <Route
          path="/resetPassword/success"
          element={<StartPage page={"resetSuccess"} />}
        />
        <Route
          path="/dashboard"
          element={
            token ? <Dashboard token={token} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
