import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import CssBaseLine from "@mui/material/CssBaseline";
import Landing from "./pages/Login/Landing";
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
          element={<Landing page={"login"} onSuccess={manageTokenSet} />}
        />
        <Route
          path="/register"
          element={<Landing page={"register"} onSuccess={manageTokenSet} />}
        />
        <Route
          path="/reset-password"
          element={<Landing page={"reset-password"} />}
        />
        <Route
          path="/reset-password/verify"
          element={<Landing page={"reset-verify"} />}
        />
        <Route
          path="/reset-password/set"
          element={<Landing page={"reset-new-password"} />}
        />
        <Route
          path="/reset-password/success"
          element={<Landing page={"reset-success"} />}
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
