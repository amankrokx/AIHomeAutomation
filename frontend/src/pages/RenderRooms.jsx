import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import currentRoom from "../components/Room/currentRoom.js"
import Room from "../components/Room/index.jsx"


const RenderRooms = () => {
    const [rooms, setRooms] = useState({})

    useEffect(() => {
        fetch("http://localhost:3000/rooms")
            .then(res => res.json())
            .then(data => {
                // sort data with active rooms first
                // data is object with room names as keys
                // and object with devices and active as values
                // active is boolean
                data = Object.fromEntries(
                    Object.entries(data).sort((a, b) => {
                        if (a[1].active && !b[1].active) {
                            return -1
                        }
                        if (!a[1].active && b[1].active) {
                            return 1
                        }
                        return 0
                    })
                )
                const keys = Object.keys(data)
                if (data[keys[0]].active)
                    currentRoom.setRoom(keys[0])
                setRooms(data)
            })
    }, [])

    return (
        <Box>
            {
                Object.keys(rooms).map(room => (
                    <Room 
                        key={room} 
                        roomName={room} 
                        isActive={rooms[room].active} 
                        initialState={rooms[room].devices}
                    />
                ))
            }
            {/* <Room roomName="bedroom" isActive /> */}
            {/* <Room roomName="bathroom" isActive />
            <Room roomName="kitchen" />
            <Room roomName="livingRoom" />
            <Room roomName="guestRoom" /> */}
        </Box>
    )
}

export default RenderRooms