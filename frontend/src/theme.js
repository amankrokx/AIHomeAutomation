import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        primary: {
            main: "#f50057",
            dark: "#ab003c",
            light: "#f73378",
            contrastText: "#fff",
        },
        mode: "dark",
    },
})

export default theme
