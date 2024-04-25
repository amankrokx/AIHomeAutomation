import { ThemeProvider } from "@mui/material/styles"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import theme from "./theme.js"
// Supports weights 100-900
import "@fontsource-variable/inter"
import { SnackbarProvider } from "notistack"
import { AuthProvider } from "./hooks/AuthContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </SnackbarProvider>
    </ThemeProvider>
)
