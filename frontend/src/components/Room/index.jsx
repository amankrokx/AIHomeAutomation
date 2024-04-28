import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useTheme } from "@mui/material"
import { IconCaretDownFilled, IconHome } from "@tabler/icons-react"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useMQTTData } from "../../hooks/MQTT/MQTT.jsx"
import { deviceIcons, roomIcons } from "./RoomIcons.jsx"
import currentRoom from "./currentRoom.js"

function camelCaseToTitleCase(text) {
    return text.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase()
    })
}

const Room = ({ roomName, isActive = false, initialState, roomIcon = <IconHome size={24}/> }) => {
    const theme = useTheme()
    const { state, turnOn } = useMQTTData(roomName, initialState)
    const [expanded, setExpanded] = useState(currentRoom.getRoom() === roomName)

    useEffect(() => {
        if (expanded && isActive)
            currentRoom.setRoom(roomName)
    }, [roomName, expanded])

    const buttonOn = {
        padding: theme.spacing(4),
        transition: "all 0.3s",
        backgroundColor: theme.palette.success.main,
        border: "2px solid " + theme.palette.success.light,
        boxShadow: "0px 0px 10px 3px " + theme.palette.success.dark,
        "&:hover": {
            boxShadow: "0px 0px 10px 6px " + theme.palette.success.dark,
        },
    }
    const buttonOff = {
        padding: theme.spacing(4),
        transition: "all 0.3s",
        backgroundColor: theme.palette.error.main,
        border: "2px solid " + theme.palette.error.light,
        boxShadow: "0px 0px 10px 3px " + theme.palette.error.dark,
        "&:hover": {
            boxShadow: "0px 0px 10px 6px " + theme.palette.error.dark,
        },
    }

    const buttonDisabled = {
        padding: theme.spacing(4),
        transition: "all 0.3s",
        backgroundColor: theme.palette.grey[600],
        border: "2px solid " + theme.palette.grey[500],
        boxShadow: "0px 0px 10px 3px " + theme.palette.grey[600],
        "&:hover": {
            boxShadow: "0px 0px 10px 6px " + theme.palette.grey[500],
        },
    }

    return (
        <Accordion
            expanded={expanded}
            onChange={() => {
                // if (isActive) {
                setExpanded(!expanded)
                // } else
                enqueueSnackbar(`${roomName} is not active.`, {
                    variant: "warning",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                    },
                    autoHideDuration: 1500,
                    preventDuplicate: true,
                })
            }}
        >
            <AccordionSummary expandIcon={isActive ? <IconCaretDownFilled /> : <IconCaretDownFilled color={theme.palette.primary.main} />}>
                {roomIcons[roomName] || roomIcon}
                <Typography marginLeft={2} variant="body1" color="grey.200">
                    {camelCaseToTitleCase(roomName)}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: theme.spacing(4),
                        padding: theme.spacing(2),
                        flexWrap: "nowrap",
                        whiteSpace: "nowrap",
                        overflowX: "scroll",
                        overflowY: "hidden",
                        scrollbarWidth: 4,
                        scrollbarHeight: 4,
                        "&::-webkit-scrollbar": {
                            width: 4,
                            height: 4,
                        },
                    }}
                >
                    {Object.keys(state).map(device => {
                        const on = state[device]
                        return (
                            <Box
                                key={device}
                                onClick={() => {
                                    if (!isActive) {
                                        enqueueSnackbar(`${roomName} is not active.`, {
                                            variant: "warning",
                                            anchorOrigin: {
                                                vertical: "top",
                                                horizontal: "center",
                                            },
                                            autoHideDuration: 1500,
                                            preventDuplicate: true,
                                        })
                                        return
                                    }
                                    console.log("Turning ", on ? "off " : "on ", device)
                                    turnOn(device, !on)
                                }}
                                sx={isActive ? (on ? buttonOn : buttonOff) : buttonDisabled}
                            >
                                {deviceIcons[device][on ? "on" : "off"]}
                            </Box>
                        )
                    })}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

export default Room
