import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { IconLogout } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import Listen from "../components/Listen/index.jsx";
import Speech from "../components/Speech/index.jsx";
import { AuthContext } from "../hooks/AuthContext.jsx";
import RenderRooms from "./RenderRooms.jsx";

const Home = () => {
    const theme = useTheme()
    const {user, logout} = useContext(AuthContext)
    const [clickEvent, setClickEvent] = useState(0)

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <Box
            sx={{
                width: "100%",
                padding: 3,
                bgcolor: "background.default",
                height: "100dvh",
            }}
        >
            <IconButton
                sx={{
                    position: "absolute",
                    top: theme.spacing(3),
                    right: theme.spacing(3),
                }}
                onClick={logout}
            >
                <IconLogout size={24} />
            </IconButton>
            <Typography
                sx={{
                    fontWeight: 500,
                    letterSpacing: "-.03em",
                    color: "transparent",
                    backgroundImage:
                        "linear-gradient(74deg,var(--bard-color-brand-text-gradient-stop-1) 0,var(--bard-color-brand-text-gradient-stop-2) 9%,var(--bard-color-brand-text-gradient-stop-3) 20%,var(--bard-color-brand-text-gradient-stop-3) 24%,var(--bard-color-brand-text-gradient-stop-2) 35%,var(--bard-color-brand-text-gradient-stop-1) 44%,var(--bard-color-brand-text-gradient-stop-2) 50%,var(--bard-color-brand-text-gradient-stop-3) 56%,var(--bard-color-surface) 75%,var(--bard-color-surface) 100%)",
                    backgroundSize: "400% 100%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    // transition: "background-position 1s",
                    animation: "fadeIn 20s ease infinite",
                }}
                variant="h4"
                component="span"
            >
                Hello, {user?.displayName.split(" ")[0]}
            </Typography>
            <br />
            <Typography
                sx={{
                    fontWeight: 500,
                    letterSpacing: "-.03em",
                    color: theme.palette.grey[800],
                    fontSize: "2rem",
                }}
                variant="h4"
                component="span"
            >
                How can I help you today?
            </Typography>

            <br />
            <br />

            <Box
                sx={{
                    position: "relative",
                    borderRadius: 2,
                    padding: 1,
                    // backgroundColor: "#1e1e1e",
                    paddingTop: 0,
                }}
            >
                {/* <Typography
                    padding={1}
                    variant="h6"
                    color="grey.400"
                    component="span"
                >
                    My Home
                </Typography> */}

                <RenderRooms />
            </Box>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Box
                id="speechBox"
                onClick={() => setClickEvent(clickEvent + 1)}
                sx={{
                    padding: 3,
                    paddingTop: 1,
                    paddingBottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "fixed",
                    width: "100vw",
                    bottom: 0,
                    left: 0,
                    borderTop: "2px solid",
                    borderColor: "primary.main",
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    // shadow upward
                    boxShadow: "0px -2px 6px 1px #f50057c7",
                    transition: "all 0.5s ease-in-out",
                    backgroundColor: "background.paper",
                }}
            >
                <Listen clickEvent={clickEvent} />
                <Speech clickEvent={clickEvent} setClickEvent={setClickEvent} />
            </Box>
        </Box>
    )
}

export default Home;