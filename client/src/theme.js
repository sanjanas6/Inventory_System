import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // blue
        },
        secondary: {
            main: "#ff9800", // orange
        },
    },
    typography: {
        fontFamily: "Roboto",
    },
});

export default theme;