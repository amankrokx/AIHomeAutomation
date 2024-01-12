import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import chatHistory from "./chatHistory.js"

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
    history: chatHistory,
})

const input = [
    `input: I'm done showering.`,
    `input 2: {    "userLocation": "bathroom",    "timerInterrupt": "false",    "devices": [        { "room": "bathroom", "device": "lamp1", "value": "on" },        { "room": "bathroom", "device": "lamp2", "value": "off" },        { "room": "bathroom", "device": "fan", "value": "off" },        { "room": "bathroom", "device": "ac", "value": "off" },        { "room": "bathroom", "device": "geyser", "value": "on" }    ],    "timers": []}`,
]
const ai = chat
export default ai