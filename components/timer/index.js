// {
//     timer: "set",
//     id: "acTimer1",
//     duration: "120",
//     description: "Turn off AC after 2 minutes",
// },

import database from "../database/index.js"
import { prompt } from "../server/index.js"

const timers = {
    // timerID: setTimeout
}


/**
 *
 * @param {Object} item
 * @param {"set"|"remove"} item.timer
 * @param {String} item.id
 * @param {String} item.duration in seconds
 * @param {String} item.description
 * @param {"bathroom"|"bedroom"} location
 */
export function handleTimer(item, location) {
    // do something
    if (item.timer === "set") {
        console.log("setting timer")
        // set the timer
        database[ location ].timers.push(item)
        timers[ item.id ] = setTimeout(() => {
            console.log("timer expired")
            // set some things in database
            const room = database[ location ]
            // set timmerInterrupt to true before sending to AI
            room.timerInterrupt = true
            // set duration on the timer to 0
            room.timers = room.timers.map(timer => {
                if (timer.id === item.id) {
                    timer.duration = 0
                }
                return timer
            })
            // report to AI using prompt
            prompt("null", location)
        }, item.duration * 1000)
    } else if (item.timer === "remove") {
        console.log("removing timer")
        // remove the timer
        clearTimeout(timers[ item.id ])
        delete timers[ item.id ]
        // find the timer in the database timers array and remove it
        const room = database[ location ]
        room.timers = room.timers.filter(timer => timer.id !== item.id)

    } else {
        console.log("unknown timer action\nDEBUG INFO:")
        console.log(item)
    }

}

// const responseExample = {
//     userLocation: "livingRoom",
//     timerInterrupt: "true",
//     devices: [
//         { room: "livingRoom", device: "lamp1", value: "on" },
//         { room: "livingRoom", device: "lamp2", value: "on" },
//         { room: "livingRoom", device: "fan", value: "on" },
//         { room: "livingRoom", device: "ac", value: "on" },
//         { room: "livingRoom", device: "tv", value: "on" },
//     ],
//     timers: [
//         { timer: "set", id: "tvTimer1", duration: "0", description: "Turn tv off after 20 mins" },
//         { timer: "set", id: "acTimer1", duration: "0", description: "Timer to turn off AC after 10 mins as orderd by user" },
//     ],
// }