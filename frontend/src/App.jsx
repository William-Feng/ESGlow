import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseLine from "@mui/material/CssBaseline";
import StartPage from "./components/StartPage";
import Dashboard from "./components/Dashboard";
import ResetMain from "./components/ResetMain";

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token"));

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
          element={<ResetMain page={"resetMain"} />}
        />
        <Route
          path="/resetPassword/verify"
          element={<ResetMain page={"resetVerify"} />}
        />
        <Route
          path="/resetPassword/setNewPassword"
          element={<ResetMain page={"resetNewPW"} />}
        />
        <Route
          path="/resetPassword/success"
          element={<ResetMain page={"resetSuccess"} />}
        />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
