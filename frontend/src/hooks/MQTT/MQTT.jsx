import { useCallback, useEffect, useState } from "react"
import sleep from "../../utils/sleep.js"
import client, { connected } from "./index.js"

export const useMQTTData = (roomName, initialState) => {
    const [state, setState] = useState((() => {
        if (!initialState) return {}
        // initial state is array of devices
        /*
        [
            {
                "room": "bathroom",
                "device": "lamp1",
                "value": "off"
            }
        ]

        state is key value pair of device and value as true or false
        */
        return initialState.reduce((acc, device) => {
            if (!device.room === roomName) return acc
            acc[device.device] = device.value === "on"
            return acc
        }, {})
    })())
    const [retry, setRetry] = useState(0)
    const [connections, setConnections] = useState([])

    /**
     *
     * @param {"lamp1"|"lamp2"|"fan"|"ac"} device
     * @returns
     */
    // const turnOn = device => {
    //     if (!roomName || !state || !(device in state)) {
    //         console.warn(roomName, state, device)
    //         console.error("Invalid device or roomName")
    //         return
    //     }
    //     client.publish(`/amankrokx-exp/${roomName}/sub`, `${device}=1`)
    // }

    const turnOn = useCallback((device, turnOn) => {
        if (!roomName || !state || !(device in state)) {
            console.warn(roomName, state, device)
            console.error("Invalid device or roomName")
            return
        }
        setState(prevState => ({ ...prevState, [device]: turnOn }))
        client.publish(`/amankrokx-esp/${roomName}/sub`, `${device}=` + (turnOn ? "1" : "0"))
    }, [roomName, state])

    useEffect(() => {
        console.log("useMQTTData for room: ", roomName)
        if (!connected) {
            sleep(500).then(() => {
                console.log("Awaiting MQTT connection")
                setRetry(prevRetry => prevRetry + 1)
            })
            return
        }

        if (connections.length === 0 && connected) {
            console.log("Trying to subscribe to room: ", roomName)
            const pubTopic = `/amankrokx-esp/${roomName}/pub`
            const subTopic = `/amankrokx-esp/${roomName}/sub`

            setConnections([client.subscribe(pubTopic), client.subscribe(subTopic)])
            console.log("Getting State for room: ", roomName)
            client.publish(subTopic, "getState")

            
            client.on("message", (topic, message) => {
                const messageData = message.toString()
                if (!messageData.includes("&")) return
                console.log("Message received: ", topic, messageData)

                if (topic === pubTopic) {
                    const data = messageData.split(":")[1]
                    const keyPairs = data.split("&")
                    const newState = keyPairs.reduce((acc, keyPair) => {
                        const [key, value] = keyPair.split("=")
                        acc[key] = value === "1"
                        return acc
                    }, {})
                    setState(newState)
                    // console.log("New state: ", newState)
                    // console.log("Setted state: ", state)
                } else if (topic === subTopic) {
                    const data = messageData
                    const keyPairs = data.split("&")
                    const partialState = keyPairs.reduce((acc, keyPair) => {
                        const [key, value] = keyPair.split("=")
                        acc[key] = value === "1"
                        return acc
                    }, {})
                    setState(prevState => ({ ...prevState, ...partialState }))
                }
            })
        }

        return () => {
            connections.forEach(connection => connection.unsubscribe())
        }
    }, [retry])

    useEffect(() => {
        console.log(roomName, state, connections)
    }, [state])

    return { state, turnOn }
}
