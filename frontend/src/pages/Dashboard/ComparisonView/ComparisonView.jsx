import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
} from "@mui/material";
import Header from "../Header";
import ComparisonSearchbar from './ComparisonSearchbar'
import ComparisonSidebar from './ComparisonSidebar'
import ComparisonDataDisplay from './ComparisonDataDisplay'
import {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect
} from "react";
import { PageContext } from "../Dashboard";
import ComparisonOverview from "./ComparisonOverview";

export const ComparisonViewContext = createContext();

export default function ComparisonView({ token }) {
  const {
    view,
    setView
  } = useContext(PageContext);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            background: "linear-gradient(45deg, #003366 30%, #336699 90%)",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
            height: 128,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <Header token={token} />
          </Toolbar>
          <Toolbar sx={{ margin: "auto" }}>
            <ComparisonViewContext.Provider
              value={{
                view,
                setView
              }}
            >
              <ComparisonSearchbar token={ token }/>
            </ComparisonViewContext.Provider>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "fixed",
            top: "128px",
            width: "100%",
            height: "calc(100vh - 128px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              maxHeight: "450px",
            }}
          >
            <ComparisonOverview/>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              overflowY: "auto",
            }}
          >
            <Drawer
              sx={{
                width: 360,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  position: "static",
                  width: 360,
                  boxSizing: "border-box",
                  overflowY: "auto",
                  maxHeight: "100%",
                  // backgroundColor: frameworksData ? "transparent" : "#f5f5f5",
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <ComparisonSidebar />
            </Drawer>
            <ComparisonDataDisplay />
          </Box>
        </Box>
      </Box>
    </>
  )
}
