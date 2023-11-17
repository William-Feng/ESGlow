import { ThemeProvider, createTheme } from "@mui/material";
import { useState, createContext } from "react";
import SingleMode from "./SingleMode/SingleMode";
import ComparisonMode from "./ComparisonMode/ComparisonMode";

export const PageContext = createContext();

function Dashboard({ token }) {
  const defaultTheme = createTheme({
    components: {
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

  const [mode, setMode] = useState("single");

  return (
    <ThemeProvider theme={defaultTheme}>
      <PageContext.Provider
        value={{
          mode,
          setMode,
        }}
      >
        {mode === "single" ? (
          <SingleMode token={token} />
        ) : (
          <ComparisonMode token={token} />
        )}
      </PageContext.Provider>
    </ThemeProvider>
  );
}

export default Dashboard;
