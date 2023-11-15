import { ThemeProvider, createTheme } from "@mui/material";
import { useState, createContext } from "react";
import SingleView from "./SingleView/SingleView";
import ComparisonView from "./ComparisonView/ComparisonView";

export const PageContext = createContext();

function Dashboard({ token }) {
  const defaultTheme = createTheme({
    components: {
      //   MuiAccordion: {
      //     styleOverrides: {
      //       root: {
      //         "&.Mui-disabled": {
      //           backgroundColor: "#D7D7D7",
      //         },
      //       },
      //     },
      //   },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          tooltip: {
            fontSize: "1rem",
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontSize: "1.5rem",
          },
        },
      },
    },
  });

  const [view, setView] = useState("single");

  return (
    <ThemeProvider theme={defaultTheme}>
      <PageContext.Provider
        value={{
          view,
          setView,
        }}
      >
        {view === "single" ? (
          <SingleView token={token} />
        ) : (
          <ComparisonView token={token} />
        )}
      </PageContext.Provider>
    </ThemeProvider>
  );
}

export default Dashboard;
