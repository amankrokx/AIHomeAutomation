import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import sleep from "../../utils/sleep.js"
import recognition, { speak } from "./index.js"

const niceEffect = {
    // nice gradient effect, activated when loading response
    fontWeight: 500,
    fontSize: "1.5rem",

    letterSpacing: "-.03em",
    color: "transparent",
    backgroundImage:
        "linear-gradient(74deg,var(--bard-color-brand-text-gradient-stop-1) 0,var(--bard-color-brand-text-gradient-stop-2) 9%,var(--bard-color-brand-text-gradient-stop-3) 20%,var(--bard-color-brand-text-gradient-stop-3) 24%,var(--bard-color-brand-text-gradient-stop-2) 35%,var(--bard-color-brand-text-gradient-stop-1) 44%,var(--bard-color-brand-text-gradient-stop-2) 50%,var(--bard-color-brand-text-gradient-stop-3) 56%,var(--bard-color-surface) 75%,var(--bard-color-surface) 100%)",
    backgroundSize: "400% 100%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    // transition: "background-position 1s",
    animation: "fadeIn 2s ease infinite",
}

const normalEffect = {
    letterSpacing: "-.03em",
    fontWeight: 500,
    display: "inline",
    color: "#b1b1b1",
    transition: "color 0.5s",
    fontSize: "1.5rem",
}

// Web speech API to convert speech to text
const Speech = ({ clickEvent, setClickEvent, location = "bedroom" }) => {
    const [currentText, setCurrentText] = useState([])
    const [isListening, setIsListening] = useState(false)
    const [timer, setTimer] = useState(0)
    const [finalTimer, setFinalTimer] = useState(0)
    const [responseText, setResponseText] = useState("")
    const [loadingResponse, setLoadingResponse] = useState(false)
    

    const setResponseTextWordByWord = async (sentence, duration) => {
        // the total speak time for sentence is duration in miliseconds
        // split sentence to words and assign time to each word based on
        // number of characters in the word
        // the time for each word is the number of characters in the word
        // mitigate for spaces and punctuation
        const words = sentence.split(" ")
        const multiplier = duration / words.length
        for (let i = 0; i < words.length; i++) {
            const word = words[i]
            setResponseText(w => w + " " + word)
            // wait for the time
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, multiplier)
            })
        }
    }

    const fetchResult = async sentence => {
        console.log("Fetching result called 🥲")
        // stop listening to avoid conflict
        setLoadingResponse(true)
        recognition.stop() // stop listening

        console.warn("Fetching result for: ", sentence)
        // const response = await fetch("http://localhost:3000/speech", {
        //     mode: "cors",
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ text: sentence, location }),
        // })
        // const data = await response.json()
        await sleep(2000)
        const data = {
            speech: Array.from({ length: 1 }, () => sentence).join(" ")
        }
        setLoadingResponse(false)
        // setResponseText(data.speech + " ")
        // getDurationOfSpeech(data.speech).then(duration => {
        //     console.log("Duration of speech: ", duration)
        //     setResponseTextWordByWord(data.speech, duration)
        // })
        // const approximateDuration = data.speech.split(" ").length / 3
        // setResponseTextWordByWord(data.speech, approximateDuration)
        setResponseText(data.speech)
        document.getElementById("ai-response-text").scrollBy(0, 10000)
        recognition.stop()
        speak(data.speech).finally(() => {
            console.log("Listening because Speaking Done")
            recognition.start()
        })
        // console.log(data)
    }

    // debounce for final sentence
    useEffect(() => {
        // if currentText does not change for 1 second consider it as final sentence
        setResponseText("")
        clearTimeout(finalTimer)
        setFinalTimer(
            setTimeout(() => {
                if (!currentText.length) return
                const sentence = currentText.map(e => e.word).join(" ")
                fetchResult(sentence)
            }, 1000)
        )
    }, [currentText])

    const sentenceToWords = sentence => {
        // debounce for last word
        clearTimeout(timer)
        setTimer(
            setTimeout(() => {
                setCurrentText(curr => {
                    if (!curr.length) return curr
                    curr[curr.length - 1].new = false
                    return [...curr]
                })
            }, 500)
        )
        // returns an array of words to render on screen
        // the latest added words have attribute new: true
        // animate the new words when rendering
        return sentence.split(" ").map((word, i) => {
            return {
                word: word,
                new: i === sentence.split(" ").length - 1,
            }
        })
    }

    useEffect(() => {
        recognition.onresult = event => {
            const current = event.resultIndex
            const transcript = event.results[current][0].transcript
            setCurrentText(sentenceToWords(transcript))
        }
    })

    useEffect(() => {
        if (currentText.length) {
            setCurrentText([])
            setResponseText("")
        }
        if (!clickEvent) return
        if (isListening) {
            recognition.stop()
            setIsListening(false)
        } else {
            console.log("Listening Because: ", clickEvent, isListening, loadingResponse, currentText, responseText)
            recognition.start()
            setIsListening(true)
        }
    }, [clickEvent])

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    padding: 3,
                    display: isListening ? "flex" : "none",
                    flexWrap: "wrap",
                    // alignItems: "center",
                    justifyContent: "flex-start",
                    maxHeight: isListening ? 300 : 0,
                    opacity: isListening ? 1 : 0,
                    transition: "all 0.5s ease-in-out",
                    color: "grey.200",
                }}
            >
                <Typography variant="caption" component="div" sx={loadingResponse ? niceEffect : normalEffect}>
                    {currentText.length > 0
                        ? currentText
                              .slice(0, currentText.length - (currentText[currentText.length - 1]?.new ? 1 : 0))
                              .map(e => e.word)
                              .join(" ")
                        : "..."}
                </Typography>
                <Typography
                    variant="caption"
                    component="div"
                    sx={{
                        display: "inline",
                        color: "primary.main",
                        transition: "color 0.5s",
                        fontSize: "1.5rem",
                    }}
                >
                    &nbsp;{currentText.length && currentText[currentText.length - 1]?.new ? currentText[currentText.length - 1].word : ""}
                </Typography>
            </Box>
            <Typography
                id="ai-response-text"
                sx={{
                    maxHeight: 300,
                    overflow: "scroll",
                    color: "grey.400",
                    paddingLeft: 3,
                    fontSize: "1.3rem",
                    paddingBottom: 1,
                    // hiidden scrollbar
                    "&::-webkit-scrollbar": {
                        width: 0,
                    },
                }}
                variant="caption"
                component="div"
            >
                {loadingResponse ? "AI: ..." : responseText ? "AI: " + responseText : ""}
            </Typography>
        </Box>
    )
}

export default Speech
