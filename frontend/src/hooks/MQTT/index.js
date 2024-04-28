import mqtt from "mqtt"

let connected = false

console.log("MQTT connecting")
const client = mqtt.connect(`wss://broker.emqx.io:8084/mqtt`, {
    // protocolVersion: 5,
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    protocolId: "MQTT",
    protocolVersion: 5,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
})

client.on("connect", () => {
    console.log("MQTT connected")
    connected = true
    client.publish("/amankrokx-esp/bedroom/pub", "Hello from frontend")
    // testUseEffect()
})

client.on("error", error => {
    console.error("MQTT error", error)
})

// function testUseEffect() {
//     const roomName = "bedroom"
//     console.log("Trying to subscribe to room: ", roomName)
//     const pubTopic = `/amankrokx-exp/${roomName}/pub`
//     const subTopic = `/amankrokx-exp/${roomName}/sub`

//     client.subscribe(pubTopic)
//     client.subscribe(subTopic)
//     console.log("Getting State for room: ", roomName)
//     client.publish(subTopic, "getState")

//     client.on("message", (topic, message) => {
//         console.log("Message received: ", topic, message.toString())
//         const messageData = message.toString()
//         if (!messageData.includes("&")) return
//         if (topic === pubTopic) {
//             const data = messageData.split(":")[1]
//             const keyPairs = data.split("&")
//             const newState = keyPairs.reduce((acc, keyPair) => {
//                 const [key, value] = keyPair.split("=")
//                 acc[key] = value === "1"
//                 return acc
//             }, {})
//             console.log("New state: ", newState)
//         } else if (topic === subTopic) {
//             const data = messageData
//             const keyPairs = data.split("&")
//             const partialState = keyPairs.reduce((acc, keyPair) => {
//                 const [key, value] = keyPair.split("=")
//                 acc[key] = value === "1"
//                 return acc
//             }, {})
//             console.log("Partial state: ", { ...partialState })
//         }
//     })
// }

export { connected }
export default client
