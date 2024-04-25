const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.interimResults = true
recognition.continuous = true
recognition.lang = "en-IN"

recognition.addEventListener("speechstart", () => {
    console.log("Audio capturing started")
})

recognition.addEventListener("speechend", () => {
    console.log("Audio capturing ended")
})

recognition.onstart = () => {
    console.log("Voice is activated, you can speak now")
}


// recognition.onend = () => {
//     recognition.start()
// }

export default recognition
