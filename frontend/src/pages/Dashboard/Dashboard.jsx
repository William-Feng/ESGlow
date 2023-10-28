import {
  ThemeProvider,
  createTheme,
} from "@mui/material";
import SingleView from "./SingleView/SingleViewMainPage";


function Dashboard({ token }) {
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <SingleView token={ token } />
    </ThemeProvider>
  );
}

export default Dashboard;
