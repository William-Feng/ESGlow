import { CssBaseline, Grid, Typography, Box, IconButton } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TuneIcon from "@mui/icons-material/Tune";
import React from "react";
import Login from "./Login";
import Register from "./Register";
import Logo from "../../assets/Logo.png";
import { useState } from "react";
import ResetInputEmail from "./ResetPassword/ResetInputEmail";
import ResetVerify from "./ResetPassword/ResetVerify";
import ResetNew from "./ResetPassword/ResetNew";
import ResetSuccess from "./ResetPassword/ResetSuccess";
import {
  headingFont,
  iconCaptionFont,
  logoFont,
  logoSizeStyle,
} from "../../styles/FontStyle";

function Landing({ page, onSuccess }) {
  const [email, setEmail] = useState(localStorage.getItem("email"));

  function setUserEmail(email) {
    setEmail(email);
    localStorage.setItem("email", email);
  }
  function removeUserEmail() {
    localStorage.removeItem("email");
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={12}
        md={8}
        sx={{
          background: "linear-gradient(135deg, #3A719B, #2C5274, #1C365A)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5rem",
        }}
      >
        <Typography variant="h1" color="white" sx={logoFont}>
          ESGlow
        </Typography>
        <Box component="img" src={Logo} alt="ESGlow Logo" sx={logoSizeStyle} />
        <Typography sx={headingFont} color="white" mb={2}>
          Empower Your Investments
        </Typography>
        <Typography
          variant="h6"
          color="white"
          mb={2}
          fontWeight="300"
          textAlign="center"
          sx={{
            "@media (max-width: 425px)": {
              display: "none",
            },
          }}
        >
          With ESGlow, venture beyond mere numbers. Harness the power of an
          intuitive design with digestible ESG data tailored just for you.
          Unravel the potential of user-friendly insights to champion informed
          decisions!
        </Typography>

        <Box
          justifyContent="center"
          sx={{ display: "flex", flexDirection: "row", gap: "10px" }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              color="primary"
              aria-label="Profound Corporate Insights"
              sx={{
                color: "#FF6B6B",
              }}
            >
              <BarChartIcon fontSize="large" />
            </IconButton>
            <Typography
              variant="body1"
              color="white"
              mt={1}
              sx={iconCaptionFont}
            >
              Profound Corporate Insights
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              color="primary"
              aria-label="Benchmark Company Performance"
              sx={{
                color: "#FF6B6B",
              }}
            >
              <CompareArrowsIcon fontSize="large" />
            </IconButton>
            <Typography
              variant="body1"
              color="white"
              mt={1}
              sx={iconCaptionFont}
            >
              Benchmark Company Performance
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              color="primary"
              aria-label="Personalised Data Interpretations"
              sx={{
                color: "#FF6B6B",
              }}
            >
              <TuneIcon fontSize="large" />
            </IconButton>
            <Typography
              variant="body1"
              color="white"
              mt={1}
              sx={iconCaptionFont}
            >
              Personalised Data Interpretations
            </Typography>
          </Grid>
        </Box>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {page === "login" && <Login onSuccess={onSuccess} />}
        {page === "register" && <Register onSuccess={onSuccess} />}
        {page === "reset-password" && <ResetInputEmail setter={setUserEmail} />}
        {page === "reset-verify" && <ResetVerify email={email} />}
        {page === "reset-new-password" && <ResetNew email={email} />}
        {page === "reset-success" && <ResetSuccess remover={removeUserEmail} />}
      </Grid>
    </Grid>
  );
}

export default Landing;
