import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import React from "react";
import Header from "./Header";
import Searchbar from "./Searchbar";
import Overview from "./Overview";
import SelectionSidebar from "./SelectionSidebar";
import DataDisplay from "./DataDisplay";

function Dashboard({ token }) {
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: "primary.main",
            height: 128,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Header />
          </Toolbar>
          <Toolbar sx={{ margin: "auto" }}>
            <Searchbar />
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "fixed",
            top: "128px",
            width: "100%",
            minHeight: "100vh",
            maxHeight: "600px",
            overflowY: "scroll",
          }}
        >
          <Box
            sx={{
              border: "dotted",
              margin: "0",
              textAlign: "center",
              maxHeight: "450px",
            }}
          >
            <Overview />
          </Box>
          <Box
            sx={{
              height: "900px",
              overflowY: "scroll",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Drawer
              sx={{
                // position: 'relative',
                width: 360,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  position: "static",
                  width: 360,
                  boxSizing: "border-box",
                  overflowY: "scroll",
                  maxHeight: "100%",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <SelectionSidebar token={token} />
            </Drawer>
            <DataDisplay />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
