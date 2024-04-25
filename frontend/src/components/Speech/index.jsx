import { Box, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import recognition from "./index.js"

// Web speech API to convert speech to text
const Speech = ({ clickEvent, setClickEvent }) => {
    const [currentText, setCurrentText] = useState([])
    const [isListening, setIsListening] = useState(false)
    const [timer, setTimer] = useState(0)
    const [shutDown, setShutDown] = useState(false)

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

    useEffect(() => {
        recognition.onresult = event => {
            const current = event.resultIndex
            const transcript = event.results[current][0].transcript
            console.log(transcript, current)
            clearInterval(shutDown) 
            setCurrentText(sentenceToWords(transcript))
        }

        recognition.onend = () => {
            if (isListening) recognition.start()
        }
    }, [isListening])

    useEffect(() => {
        if (currentText.length) setCurrentText([])
        if (!clickEvent) return
        if (isListening) {
            recognition.stop()
            setIsListening(false)
        } else {
            recognition.start()
            setIsListening(true)
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

export default Speech
