import { createInterface } from "readline"

/**
 * @description Ask a question in the console and return the user's input
 * @param {String} question 
 * @returns 
 */
function ask(question) {
    return new Promise((resolve, reject) => {
        const readline = createInterface({
            input: process.stdin,
            output: process.stdout
        })

        readline.question(question, path => {
            readline.close()
            resolve(path)
        })
    })
}

export default ask