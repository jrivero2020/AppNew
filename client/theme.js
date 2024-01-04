import { createTheme } from "@mui/material/";
import { blue, red, green, pink } from "@mui/material/colors";
import { esES as esESCore } from "@mui/material/locale";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      dark: blue[800],
      light: blue[500],
      contrastText: "#ffffff",
    },
    secondary: {
      main: green[700],
      dark: green[800],
      light: green[500],
      contrastText: "#ffffff",
    },
    background: {
      paper: "#fff",
    },
    error: {
      main: red.A400,
    },
    openTitle: "#3f4771",
    protectedTitle: pink["400"],
    type: "light",
  },
  esESCore,
});

export default theme;
