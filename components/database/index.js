const database = {
    bathroom: {
        userLocation: "bathroom",
        timerInterrupt: "false",
        devices: [{ room: "bathroom", device: "lamp1", value: "off" }],
        timers: [],
        active: null,
    },
    bedroom: {
        userLocation: "bedroom",
        timerInterrupt: "false",
        devices: [
            { room: "bedroom", device: "lamp1", value: "off" },
            { room: "bedroom", device: "lamp2", value: "off" },
            { room: "bedroom", device: "fan", value: "off" },
            { room: "bedroom", device: "ac", value: "off" },
        ],
        timers: [],
        active: null,
    },
    kitchen: {
        userLocation: "kitchen",
        timerInterrupt: "false",
        devices: [
            { room: "kitchen", device: "lamp1", value: "off" },
            { room: "kitchen", device: "lamp2", value: "off" },
            { room: "kitchen", device: "fan", value: "off" },
        ],
        timers: [],
        active: false,
    },
    livingRoom: {
        userLocation: "livingRoom",
        timerInterrupt: "false",
        devices: [
            { room: "livingRoom", device: "lamp1", value: "off" },
            { room: "livingRoom", device: "lamp2", value: "off" },
            { room: "livingRoom", device: "fan", value: "off" },
            { room: "livingRoom", device: "ac", value: "off" },
            { room: "livingRoom", device: "tv", value: "off" },
        ],
        timers: [],
        active: false,
    },
    guestRoom: {
        userLocation: "guestRoom",
        timerInterrupt: "false",
        devices: [
            { room: "guestRoom", device: "lamp1", value: "off" },
            { room: "guestRoom", device: "lamp2", value: "off" },
            { room: "guestRoom", device: "fan", value: "off" },
            { room: "guestRoom", device: "ac", value: "off" },
        ],
        timers: [],
        active: false,
    },
}

export default database