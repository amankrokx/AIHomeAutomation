// box with a mic and border animation behind it that listens for audio input
// and sends it to the server for processing
// use web speech api to listen for audio input

import { Box } from "@mui/material"
import { useEffect } from "react"
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer"

const Listen = ({ clickEvent }) => {
    const recorderControls = useVoiceVisualizer()
    const {
        // ... (Extracted controls and states, if necessary)
        error,
        audioRef,
        stopRecording,
        clearCanvas,
        startRecording,
        isRecordingInProgress,
    } = recorderControls

    useEffect(() => {
        if (!error) return

        console.error(error)
    }, [error])

    useEffect(() => {
        if (!clickEvent) return
        if (isRecordingInProgress) {
            stopRecording()
            clearCanvas()
        } else {
            startRecording()
        }
    }, [clickEvent])

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.addEventListener("start", event => {
                console.log("Visualisations started")
            })
        })()
    }, [])

    return (
        <div
            style={{
                width: "100%",
                // height: isRecordingInProgress ? 240 : 110,
                transition: "height 0.5s ease-in-out",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: "calc(50% - 24px)",
                    display: "grid",
                    height: "100%",
                    placeItems: "center",
                    opacity: isRecordingInProgress ? 0 : 1,
                    transition: "opacity 0.5s ease-in-out",
                }}
            >
                <svg
                    style={
                        {
                            // backgroundImage:
                            //     "linear-gradient(74deg,var(--bard-color-brand-text-gradient-stop-1) 0,var(--bard-color-brand-text-gradient-stop-2) 9%,var(--bard-color-brand-text-gradient-stop-3) 20%,var(--bard-color-brand-text-gradient-stop-3) 24%,var(--bard-color-brand-text-gradient-stop-2) 35%,var(--bard-color-brand-text-gradient-stop-1) 44%,var(--bard-color-brand-text-gradient-stop-2) 50%,var(--bard-color-brand-text-gradient-stop-3) 56%,var(--bard-color-surface) 75%,var(--bard-color-surface) 100%)",
                            // backgroundSize: "400% 100%",
                            // backgroundClip: "text",
                            // WebkitBackgroundClip: "text",
                            // WebkitTextFillColor: "transparent",
                            // animation: "fadeIn 20s ease infinite",
                        }
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width={48}
                    height={48}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-microphone"
                >
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            {/*     --bard-color-brand-text-gradient-stop-1: #4285f4;
            --bard-color-brand-text-gradient-stop-1-rgb: 66, 133, 244;
            --bard-color-brand-text-gradient-stop-2: #9b72cb;
            --bard-color-brand-text-gradient-stop-2-rgb: 155, 114, 203;
            --bard-color-brand-text-gradient-stop-3: #d96570;
            --bard-color-brand-text-gradient-stop-3-rgb: 217, 101, 112;
            --bard-color-surface: #131314; */}
                            <stop offset="0%" style={{ stopColor: "#4285f4", stopOpacity: 1 }} />
                            <stop offset="25%" style={{ stopColor: "#9b72cb", stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: "#d96570", stopOpacity: 1 }} />
                            <stop offset="75%" style={{ stopColor: "#9b72cb", stopOpacity: 1 }} />

                            <animate attributeName="x1" values="0%;50%;0%" dur="5s" repeatCount="indefinite" />
                        </linearGradient>
                    </defs>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        fill="url(#grad1)"
                        stroke="transparent"
                        d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4"
                    />
                </svg>
            </Box>

            <Box
                sx={{
                    transform: "translate(18.75%, 0)",
                }}
            >
                <VoiceVisualizer
                    ref={audioRef}
                    controls={recorderControls}
                    isControlPanelShown={false}
                    height={100}
                    width={"75%"}
                    speed={1}
                    barWidth={12}
                    gap={1}
                    rounded={4}
                    isDownloadAudioButtonShown={false}
                    backgroundColor="transparent"
                    mainBarColor="#4285f4"
                    secondaryBarColor="transparent"
                    // TODO: Set to false to create own UI
                    isDefaultUIShown={false}
                    defaultAudioWaveIconColor="#4285f4"
                    defaultMicrophoneIconColor="#4285f4"
                />
            </Box>
        </div>
    )
}

export default Listen
