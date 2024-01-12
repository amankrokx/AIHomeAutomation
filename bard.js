// node --version # Should be >= 18
// npm install @google/generative-ai

import { connect } from "mqtt"
import ai from "./components/ai/index.js"
import ask from "./components/ask/index.js"
import { setCallback } from "./components/server/index.js"


let dataArrived = false

const database = {
    bathroom: {
        userLocation: "bathroom",
        timerInterrupt: "false",
        devices: [
            { room: "bathroom", device: "lamp1", value: "on" },
            { room: "bathroom", device: "lamp2", value: "off" },
            { room: "bathroom", device: "fan", value: "off" },
            { room: "bathroom", device: "ac", value: "off" },
            { room: "bathroom", device: "geyser", value: "off" },
        ],
        timers: [],
    },
    bedroom: {
        userLocation: "bedroom",
        timerInterrupt: "false",
        devices: [
            { room: "bedroom", device: "lamp1", value: "on" },
            { room: "bedroom", device: "lamp2", value: "off" },
            { room: "bedroom", device: "fan", value: "off" },
            { room: "bedroom", device: "ac", value: "off" },
        ],
        timers: [],
    }
}

console.log("MQTT connecting")
const client = connect("mqtt://broker.emqx.io:1883", {
    protocolId: "MQTT",
    protocolVersion: 5,
})

Object.keys(database).forEach((location) => {
    console.log("Subscribing to topic", `/amankrokx-esp/${location}/pub`)
    client.subscribe(`/amankrokx-esp/${location}/pub`)
})

client.on("message", (topic, message) => {
    const data = message.toString()
    if (data.startsWith("outData:")) {
        // data is coming on topic /amankrokx-esp/bedroom/pub
        // data is formed like lamp1=1&lamp2=0&fan=0&ac=0&tv=1
        const location = topic.split("/")[2]
        dataArrived = true
        const returnedData = data.split("outData:")[1]
        returnedData.split("&").map((item) => {
            // split by = and then update the database
            const [key, value] = item.split("=")
            database[location].devices.filter((device) => device.device === key)[0].value = (value === "1" ? "on" : "off")
        })
    }
    // else console.log("MQTT message not recognized")
})

/**
 * @description Waits at max 2 seconds to check if latest data has arrived for the location or not
 * @param {string} location 
 * @returns {Promise<Boolean>}
 */
const getDeviceStateVariables = async (location) => {
    dataArrived = false
    client.publish(`/amankrokx-esp/${location}/sub`, "getState")
    // now wait for 2 seconds, keep checking if data has arrived or not
    let count = 0
    while (!dataArrived && count < 20) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        count++
    }
    return dataArrived
}

client.on("connect", async () => {
    console.log("MQTT connected")
    while (client.connected) {
        // confirm to send more messages
        await prompt(await ask("Enter your prompt: "))
    }
})

async function prompt (question) {
    const location = "bedroom"
    const newDataReturned = await getDeviceStateVariables(location)
    if (!newDataReturned) {
        console.log("Could not get latest data\n")
    } else console.log(database[location])
    const input = ["", ""]
    input[0] = `input: ${question}`
    input[1] = `input 2: ${newDataReturned ? JSON.stringify(database[location]) : undefined}`
    const result = await ai.sendMessage(input)
    const response = result.response
    const text = response.text()
    // console.log(text)
    // split text into two parts one starts with "output: "and other with "output 2: "
    const textParts = text.split("output 2: ")
    const output = textParts[0].split("output: ")[1]
    const output2 = textParts[1]
    const json = JSON.parse(output2)
    console.log(output, json)
    // convert to key=value&key=value string
    // json is an array
    /*
    [    { "room": "bathroom", "device": "lamp2", "value": "on" }]

    on means 1, use device name = 1
    if room is bathroom then only
    */
    let string = ""
    let arr = []
    for (const item of json) {
        if (item.room === location) {
            arr.push(`${item.device}=${item.value === 'on' ? 1 : 0}`)
        }
    }
    string = arr.join("&")
    // publish to the topic
    if (string.length !== 0)
        client.publish(`/amankrokx-esp/${location}/sub`, string)

    return output
}

setCallback(prompt)