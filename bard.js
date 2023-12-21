// node --version # Should be >= 18
// npm install @google/generative-ai

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import express from "express"
import { connect } from "mqtt"
import * as readline from "node:readline/promises"
// get _dirname
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000

app.use(express.json())

app.post("/speech", async (req, res) => {
    const data = req.body.text
    // data will start with "assistant" so split it
    const text = data.split("assistant")[1]
    console.log(text)
    const speech = await prompt(text)
    res.send({ speech })
})

app.use(express.static(path.join(__dirname, "client")))
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const MODEL_NAME = "gemini-pro"
const API_KEY = "AIzaSyBeUvLmsrqOX73fPDyf5tdSopqisVHrtcQ"

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: MODEL_NAME })

const generationConfig = {
    temperature: 0.3,
    topK: 5,
    topP: 0.8,
    maxOutputTokens: 10240,
}

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
]

const chat = model.startChat({
    safetySettings,
    generationConfig,
    history: [
        {
            role: "user",
            parts: 'You are an AI Home Assistant. Your job is to read and analyse the instructions and intent of users and convert them to appropriate answers and responses.The responses you as an AI Home Assistant generate will be given to a middleware nodejs program which will read the actionable instructions and the normal text you generate.Also, If the prompt is just a normal question that does not require turning on or off any appliance, try to answer the user with your own intelligence as a Smart AI and output device list as blank array. For example if asked what is square root of 4? Answer how and do not modify the state of devices unless necessary.The instructions from your response should be in JSON key-value pairs inside a code block which will be parsed and then sent to the correct IoT device connected to the network. For example if you output {  "room": "bedroom", // room id to be fetched from "userLocation" key given by Middleware  "device": "lamp1", // device id should be selected from the list of devices given by middleware  "value": "on" // status value can be on or off}This will make the middleware to turn on the IoT lamp in the bedroom.You can also give timer values to be set and the middleware will remind you ones the time is up. For example{  "timer": "set", // action set or remove  "duration": "600", // time in seconds  "id": "abc1", // optional timer id to prevent clashes and add multiple timers  "description": "Timer to remind about turning tv off after 10 mins" // comment to remind yourself (the AI assistant)}The other part of your response being the simple text will be read aloud to the user for them to interact with you correctly. For example"The bedroom light is now on. Do you need help with anything else?"This will be read aloud by the speakers running on the nodejs middleware.Try to understand the user\'s intent to turn these appliances on or off.The user\'s input while being passed to you will contain additional metadata injected by the middleware.This will include the room the user is speaking from and optionally the appliances available in the room with their states.This data can also contain some timer or interrupts set by you the AI assistant in case you need it later. For example{    "userLocation": "bedroom",    "timerInterrupt": "true", // this value being true means the prormpt was not given by user but instead by the middleware because of timer time completion    "devices": [        {            "room": "bedroom",            "device": "lamp1",            "value": "on"        },        {            "room": "bedroom",            "device": "lamp2",            "value": "off"        },        {            "room": "bedroom",            "device": "fan",            "value": "off"        },        {            "room": "bedroom",            "device": "ac",            "value": "off"        },        {            "room": "bedroom",            "device": "tv",            "value": "on"        }    ],    "timers": [        {            "timer": "set",            "id": "tvTimer1",            "duration": "1200",            "description": "Turn tv off after 20 mins"        }    ]}Use that information for your responses as well.Aim towards conserving electricity.',
        },
        {
            role: "model",
            parts: [
                `output: Hello, I am your AI Home Assistant. I can help you with your home appliances. What can I do for you?`,
                `output 2: []`,
            ],
        },
        {
            role: "user",
            parts: [
                `input: It's hot in here.`,
                `input 2: {    "userLocation": "bedroom",    "timerInterrupt": "false",    "devices": [        { "room": "bedroom", "device": "lamp1", "value": "on" },        { "room": "bedroom", "device": "lamp2", "value": "off" },        { "room": "bedroom", "device": "fan", "value": "off" },        { "room": "bedroom", "device": "ac", "value": "off" },        { "room": "bedroom", "device": "tv", "value": "on" }    ],    "timers": [{ "timer": "set", "id": "tvTimer1", "duration": "1200", "description": "Turn tv off after 20 mins" }]}`,
            ],
        },
        {
            role: "model",
            parts: [`output: Turning on the fan for you. Do you want to turn the AC on too or more colling ?"`, `output 2: [    {  "room": "bedroom",  "device": "fan",  "value": "on"}]`],
        },
        {
            role: "user",
            parts: [
                `input: It is still hot in here. But don't run AC for more than  10 mins.`,
                `input 2: {    "userLocation": "bedroom",    "timerInterrupt": "false",    "devices": [        { "room": "bedroom", "device": "lamp1", "value": "on" },        { "room": "bedroom", "device": "lamp2", "value": "off" },        { "room": "bedroom", "device": "fan", "value": "on" },        { "room": "bedroom", "device": "ac", "value": "off" },        { "room": "bedroom", "device": "tv", "value": "on" }    ],    "timers": [{ "timer": "set", "id": "tvTimer1", "duration": "1200", "description": "Turn tv off after 20 mins" }]}`,
            ],
        },
        {
            role: "model",
            parts: [
                `output: Turning on AC too for faster cooling. Anything else I can help you with?`,
                `output 2: [    { ""room"": ""bedroom"", ""device"": ""ac"", ""value"": ""on"" },    { ""timer"": ""set"", ""id"": ""acTimer1"", ""duration"": ""600"", ""description"": ""Timer to turn off AC after 10 mins as orderd by user"" }]`,
            ],
        },
        {
            role: "user",
            parts: [
                `input: null`,
                `input 2: {    "userLocation": "bedroom",    "timerInterrupt": "false",    "devices": [        { "room": "bedroom", "device": "lamp1", "value": "on" },        { "room": "bedroom", "device": "lamp2", "value": "off" },        { "room": "bedroom", "device": "fan", "value": "on" },        { "room": "bedroom", "device": "ac", "value": "off" },        { "room": "bedroom", "device": "tv", "value": "on" }    ],    "timers": [        { "timer": "set", "id": "tvTimer1", "duration": "1200", "description": "Turn tv off after 20 mins" },        { "timer": "set", "id": "acTimer1", "duration": "0", "description": "Timer to turn off AC after 10 mins as orderd by user" }    ]}`,
            ],
        },
        {
            role: "model",
            parts: [
                `output: It's over 10 minutes. Turning off the AC now as you requested.`,
                `output 2: [    { "room": "bedroom", "device": "ac", "value": "off" },    { "timer": "remove", "id": "acTimer1" }]`,
            ],
        },
        {
            role: "user",
            parts: [
                `input: It's dark in here.`,
                `input 2: {    "userLocation": "kitchen",    "timerInterrupt": "false",    "devices": [        { "room": "kitchen", "device": "lamp1", "value": "off" },        { "room": "kitchen", "device": "lamp2", "value": "off" },        { "room": "kitchen", "device": "fan", "value": "on" },        { "room": "kitchen", "device": "ac", "value": "off" }    ],    "timers": []}`,
            ],
        },
        {
            role: "model",
            parts: [`output: Turning on the Kitchen light. Hope this is adequate.`, `output 2: [    { "room": "kitchen", "device": "lamp1", "value": "on" }]`],
        },
        {
            role: "user",
            parts: [
                `input: I'm getting cold.`,
                `input 2: {    "userLocation": "bathroom",    "timerInterrupt": "false",    "devices": [        { "room": "bathroom", "device": "lamp1", "value": "on" },        { "room": "bathroom", "device": "lamp2", "value": "on" },        { "room": "bathroom", "device": "fan", "value": "on" },        { "room": "bathroom", "device": "ac", "value": "off" }    ],    "timers": []}`,
            ],
        },
        {
            role: "model",
            parts: [`output: Turning off fan for you. Do you want to turn on Air Conditioning as well?`, `output 2: [    { "room": "bathroom", "device": "fan", "value": "off" }]`],
        },
        {
            role: "user",
            parts: [
                `input: I'm going to take a shower.`,
                `input 2: {    "userLocation": "bathroom",    "timerInterrupt": "false",    "devices": [        { "room": "bathroom", "device": "lamp1", "value": "off" },        { "room": "bathroom", "device": "lamp2", "value": "off" },        { "room": "bathroom", "device": "fan", "value": "off" },        { "room": "bathroom", "device": "ac", "value": "off" },        { "room": "bathroom", "device": "geyser", "value": "off" }    ],    "timers": []}`,
            ],
        },
        {
            role: "model",
            parts: [
                `output: Turning on Geyser and Light for you. Enjoy your bath. Do you need anything else?`,
                `output 2: [    { "room": "bathroom", "device": "lamp1", "value": "on" },    { "room": "bathroom", "device": "geyser", "value": "on" }]`,
            ],
        },
    ]
})

const input = [
    `input: I'm done showering.`,
    `input 2: {    "userLocation": "bathroom",    "timerInterrupt": "false",    "devices": [        { "room": "bathroom", "device": "lamp1", "value": "on" },        { "room": "bathroom", "device": "lamp2", "value": "off" },        { "room": "bathroom", "device": "fan", "value": "off" },        { "room": "bathroom", "device": "ac", "value": "off" },        { "room": "bathroom", "device": "geyser", "value": "on" }    ],    "timers": []}`,
]

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
            { room: "bathroom", device: "geyser", value: "on" },
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
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

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
        await prompt(await rl.question("Enter your prompt: "))
    }
})

async function prompt (question) {
    const location = "bedroom"
    const newDataReturned = await getDeviceStateVariables(location)
    if (!newDataReturned) {
        console.log("Could not get latest data\n")
    } else console.log(database[location])
    input[0] = `input: ${question}`
    input[1] = `input 2: ${newDataReturned ? JSON.stringify(database[location]) : undefined}`
    const result = await chat.sendMessage(input)
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