import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useTheme } from "@mui/material"
import { IconBathFilled, IconCaretDownFilled, IconLamp, IconLamp2, IconPointFilled } from "@tabler/icons-react"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"


const Room = ({ roomName, isActive = false }) => {
    const theme = useTheme()
    const [expanded, setExpanded] = useState(false)
    
    const button = {
            padding: theme.spacing(8),
            transition: "all 0.3s",
            backgroundColor: theme.palette.success.main,
            border: "1px solid " + theme.palette.success.light,
            boxShadow: "0px 0px 10px 4px " + theme.palette.success.dark,
            "&:hover": {
                border: "2px solid " + theme.palette.success.light,
                boxShadow: theme.shadows[3],
            }
        }
    return (
        <Accordion
            expanded={expanded}
            onChange={() => {
                if (isActive) {
                    setExpanded(!expanded)
                } else
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
            <AccordionSummary expandIcon={isActive ? <IconCaretDownFilled /> : <IconPointFilled color={theme.palette.primary.main} />}>
                <IconBathFilled size={24}/>
                <Typography marginLeft={2} variant="body1" color="grey.200">
                    {roomName}
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
                    }}
                >
                    <Box sx={button}>
                        <IconLamp size={48} />
                    </Box>
                    <Box
                        sx={{
                            padding: theme.spacing(8),
                            transition: "all 0.3s",
                            backgroundColor: theme.palette.grey[800],
                            // border: "1px solid " + theme.palette.grey[500],
                            boxShadow: "0px 0px 10px 4px " + theme.palette.grey[900],
                            "&:hover": {
                                border: "2px solid " + theme.palette.success.main,
                                boxShadow: "0px 0px 10px 4px " + theme.palette.success.dark,
                                backgroundColor: theme.palette.success.main,
                            },
                        }}
                    >
                        <IconLamp2 size={48} />
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

export default Room
