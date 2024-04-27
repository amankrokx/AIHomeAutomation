import { Box, Button, Divider, TextField, Typography, useTheme } from "@mui/material";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "../firebase/auth/index.js";
import { AuthContext } from "../hooks/AuthContext.jsx";

const Login = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signup, setSignup] = useState(false);
    const theme = useTheme()
    const authContext = useContext(AuthContext)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if (authContext.user) {
            // console.log(authContext.user)
            if (window.location.pathname === "/login")
                window.location.pathname = "/"
        }

        
    }, [authContext.user])

    return (
        <Box
            sx={{
                width: "100%",
                padding: 4,
                bgcolor: "background.default",
                height: "100dvh",
                maxWidth: 400,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h2" color="primary">
                {signup ? "Sign Up" : "Login"}
            </Typography>
            <br />
            <br />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing(3),
                    alignItems: "stretch",
                }}
            >
                {signup ? (
                    <TextField
                        label="Name"
                        value={name || ""}
                        onChange={e => {
                            setName(e.target.value)
                        }}
                    />
                ) : null}
                <TextField
                    label="Email"
                    value={username || ""}
                    onChange={e => {
                        setUsername(e.target.value)
                    }}
                />
                <TextField
                    label="Password"
                    value={password || ""}
                    type="password"
                    onChange={e => {
                        setPassword(e.target.value)
                    }}
                />
                <Button
                    variant="contained"
                    disabled={disabled}
                    onClick={async () => {
                        try {
                            if (signup) await signUpWithEmail(username, password, name)
                            else await signInWithEmail(username, password)

                            setDisabled(true)
                        } catch (error) {
                            alert(error.message || "Something went wrong. Please try again.")
                        } finally {
                            setDisabled(false)
                        }
                    }}
                >
                    {signup ? "Sign Up" : "Login"}
                </Button>
                <Divider />
                <Button
                    disabled={disabled}
                    onClick={() => {
                        setSignup(!signup)
                    }}
                >
                    {!signup ? "Sign Up" : "Login"} with Email
                </Button>
                <Typography variant="body2" margin="auto" color="primary.dark">
                    Or continue with
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<IconBrandGoogle />}
                    sx={{
                        fontWeight: "bolder",
                        // google brand colors gradient with abrupt distinction
                        // #4285f4, #34a853, #fbbc05, #ea4335
                        // no mixing of colors, solid colors only
                        // show the background gradient on border only
                        border: "5px solid",
                        borderImageSlice: 1,
                        borderImageSource: "linear-gradient(20deg, #4285f4, #4285f4, #34a853, #34a853, #fbbc05, #fbbc05, #ea4335, #ea4335)",
                        backgroundColor: "transparent",
                        transition: "border-image-source 1s ease",

                        "&:hover": {
                            borderImageSource: "linear-gradient(-20deg, #4285f4, #4285f4, #34a853, #34a853, #fbbc05, #fbbc05, #ea4335, #ea4335)",
                            backgroundColor: "transparent",
                            
                        }
                    }}
                    onClick={signInWithGoogle}
                >
                    Google
                </Button>
            </Box>
        </Box>
    )
}

export default Login;