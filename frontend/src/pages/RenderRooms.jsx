import { Box } from "@mui/material"
import Room from "../components/Room/index.jsx"


const RenderRooms = () => {

    return (
        <Box>
            <Room roomName="Bedroom" isActive />
            <Room roomName="Bathroom" isActive />
            <Room roomName="Kitchen" />
            <Room roomName="Living Room" />
            <Room roomName="Guest Room" />
        </Box>
    )
}

export default RenderRooms