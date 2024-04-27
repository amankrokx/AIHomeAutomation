import { Box, Typography } from "@mui/material"
import { useCheetah } from "@picovoice/cheetah-react"
import { usePorcupine } from "@picovoice/porcupine-react"
import { useEffect, useState } from "react"
import { ACCESS_KEY, cheetahModel, porcupineKeyword, porcupineModel } from "./index.js"

// Web speech API to convert speech to text
const SpeechV2 = ({ clickEvent, setClickEvent }) => {
    const [currentText, setCurrentText] = useState([])
    const [timer, setTimer] = useState(0)
    const [shutDown, setShutDown] = useState(false)
    const {
        result: result_cheetah,
        isLoaded: isLoaded_cheetah,
        isListening: isListening_cheetah,
        error: error_cheetah,
        init: init_cheetah,
        start: start_cheetah,
        stop: stop_cheetah,
        release: release_cheetah,
    } = useCheetah()
    const { keywordDetection, isLoaded, isListening, error, init, start, stop, release } = usePorcupine()

    useEffect(() => {
        console.log("isLoaded", isLoaded)
        console.log("error", error)
        console.log("isListening", isListening)
    }, [isLoaded, error, isListening])

    useEffect(() => {
        init(ACCESS_KEY, porcupineKeyword, porcupineModel)
        init_cheetah(ACCESS_KEY, cheetahModel)
    }, [])

    useEffect(() => {
        if (keywordDetection !== null) {
            // ... use keyword detection result
            console.log(keywordDetection);
            (async () => {
                await start_cheetah()
            })()
        }
        console.log("result_cheetah", result_cheetah)
        if (result_cheetah.isComplete) {
            setCurrentText(sentenceToWords
        }
    }, [keywordDetection, result_cheetah])

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
            }, 1000)
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

    // useEffect(() => {
    //     recognition.onresult = event => {
    //         const current = event.resultIndex
    //         const transcript = event.results[current][0].transcript
    //         console.log(transcript, current)
    //         clearInterval(shutDown)
    //         setCurrentText(sentenceToWords(transcript))
    //     }

    //     recognition.onend = () => {
    //         if (isListening) recognition.start()
    //     }
    // }, [isListening])

    useEffect(() => {
        if (currentText.length) setCurrentText([])
        if (!clickEvent) return
        if (!isListening) {
            ;(async () => await start())()
            console.log("Listening")
        } else {
            ;(async () => await stop())()
            console.log("Stopped listening")
        }
    }, [clickEvent])

    return (
        <Box
            sx={{
                width: "100%",
                padding: 3,
                display: isListening ? "flex" : "none",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-start",
                maxHeight: isListening ? 300 : 0,
                opacity: isListening ? 1 : 0,
                transition: "all 0.5s ease-in-out",
                color: "grey.200",
            }}
        >
            {currentText.map((word, i) => (
                <Typography
                    key={i}
                    variant="caption"
                    component="div"
                    sx={{
                        display: "inline",
                        color: word.new ? "primary.main" : "inherit",
                        transition: "color 0.5s",
                        fontSize: "1.5rem",
                    }}
                >
                    {word.word}&nbsp;
                </Typography>
            ))}
        </Box>
    )
}

export default SpeechV2
