const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.interimResults = true
recognition.continuous = true
recognition.lang = "en-IN"

recognition.onstart = () => {
    console.log("Voice is activated, you can speak now")
}

// recognition.onend = () => {
//     recognition.start()
// }

/**
 * @description returns the duration of speech in ms
 * @param {String} sentence
 * @returns {Promise<Number>}
 */
function getDurationOfSpeech(sentence) {
    return new Promise((resolve, reject) => {
        const speech = new SpeechSynthesisUtterance(sentence)
        speech.lang = "en-IN"
        speech.rate = 50
        speech.volume = 0
        speech.pitch = 1
        speech.onstart = () => {}
        speech.onend = e => {
            resolve((e.elapsedTime / speech.rate) * 30 - 500)
        }
        window.speechSynthesis.speak(speech)
    })
}

async function speak(text) {
    // speak the response
    return new Promise((resolve, reject) => {
        const speech = new SpeechSynthesisUtterance(text)
        speech.lang = "en-IN"
        speech.rate = 1
        speech.volume = 1
        speech.pitch = 1
        speech.onstart = () => {
            // set later to sync with text output
            // stop listening to avoid conflict
        }
        speech.onend = e => {
            // set later to sync with text output
            // start listening
            resolve()
        }

        // get the predicted duration of speech
        // const duration = data.speech.split(" ").length / 3
        // speak now
        window.speechSynthesis.speak(speech)
    })
}

export { getDurationOfSpeech, speak }
export default recognition
