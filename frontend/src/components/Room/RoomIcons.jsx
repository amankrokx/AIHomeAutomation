import { IconAirConditioning, IconAirConditioningDisabled, IconBathFilled, IconBedFilled, IconBulb, IconBulbOff, IconDeviceGamepad, IconDeviceTv, IconDeviceTvOff, IconGhostFilled, IconLamp, IconLampOff, IconPropeller, IconPropellerOff, IconToolsKitchen } from "@tabler/icons-react"
const deviceIcons = {
    lamp1: {
        on: <IconLamp size={48} />,
        off: <IconLampOff size={48} />,
    },
    lamp2: {
        on: <IconBulb size={48} />,
        off: <IconBulbOff size={48} />,
    },
    fan: {
        on: <IconPropeller size={48} />,
        off: <IconPropellerOff size={48} />,
    },
    ac: {
        on: <IconAirConditioning size={48} />,
        off: <IconAirConditioningDisabled size={48} />,
    },
    tv: {
        on: <IconDeviceTv size={48} />,
        off: <IconDeviceTvOff size={48} />,
    }
}

const roomIcons = {
    bedroom: <IconBedFilled size={24} />,
    bathroom: <IconBathFilled size={24} />,
    kitchen: <IconToolsKitchen size={24} />,
    livingRoom: <IconDeviceGamepad size={24} />,
    guestRoom: <IconGhostFilled size={24} />,
}

export { deviceIcons, roomIcons }

