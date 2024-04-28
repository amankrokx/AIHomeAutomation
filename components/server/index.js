import express from "express"
// get _dirname
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import database from "../database/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let serverOn = false


const app = express()
const port = 3000

let callback = async () => {
    console.log("callback not set")
    return "callback not set"
}

app.use(express.json())
app.use(cors({
    origin: "*"
}))

/**
 * 
 * @param {async function} cb 
 */
app.post("/speech", async (req, res) => {
    const data = req.body.text
    const location = req.body.location || "bedroom"
    // data will start with "assistant" so split it
    const text = data //.split("assistant")[1]
    console.log(text)
    const speech = await callback(text, location)
    res.send({ speech })
})

app.get("/rooms", (req, res) => {
    res.send(database)
})

// app.use(express.static(path.join(__dirname, "client")))
// react app in ./client/index.html
// re route all requests to index.html
app.use(express.static(path.join(__dirname, "client")))
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"))
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

/**
 * 
 * @param {async function} cb 
 */
const setCallback = (cb) => {
    callback = cb
}
export { callback as prompt, setCallback }

