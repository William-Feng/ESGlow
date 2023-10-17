import { CssBaseline, Grid, Typography, Box, IconButton } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TuneIcon from "@mui/icons-material/Tune";
import React from "react";
import Login from "./Login";
import Register from "./Register";
import Logo from "../assets/logo-white.png";

export default function StartPage({ page, onSuccess }) {
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={8}
        sx={{
          background: "linear-gradient(135deg, #2C5274, #203A53, #0F2017)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5rem",
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="ESGlow Logo"
          sx={{ width: "320px", marginBottom: "2rem" }}
        />

        <Typography variant="h3" color="white" mb={2}>
          Empower Your Investments
        </Typography>
        <Typography
          variant="h6"
          color="white"
          mb={2}
          fontWeight="300"
          textAlign="center"
        >
          With ESGlow, venture beyond mere numbers. Harness the power of an
          intuitive design with digestible ESG data tailored just for you.
          Unravel the potential of user-friendly insights to champion informed
          decisions!
        </Typography>

        <Grid container spacing={8} justifyContent="center">
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
              sx={{
                maxWidth: "200px",
                textAlign: "center",
              }}
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
              sx={{
                maxWidth: "200px",
                textAlign: "center",
              }}
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
              sx={{
                maxWidth: "200px",
                textAlign: "center",
              }}
            >
              Personalised Data Interpretations
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sm={4}
        md={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {page === "login" && <Login onSuccess={onSuccess} />}
        {page === "register" && <Register onSuccess={onSuccess} />}
      </Grid>
    </Grid>
  );
}
