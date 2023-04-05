import F from './index.js'
import minimist from 'minimist'
import readline from 'readline'

const argv = minimist(process.argv.slice(2))
// console.log(argv)
const dir = argv['_'][0]
let { p: pattern, f: fileFilter, o: onlyMatching, i: ignoreCase } = argv

async function run() {
    if (!pattern) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        pattern = await question(rl, 'Input complex pattern: ')
        rl.close()
    }
    const flags = ignoreCase ? 'ig' : 'g'
    pattern = new RegExp(pattern, flags)
    
    let results = await F.find(pattern, dir, fileFilter)
    for (const r of results) {
        const arr = onlyMatching ? r.matches : r.lines
        arr.forEach((m) => console.log(m))
    }
}

function question(rl, query) {
    return new Promise(resolve => {
        rl.question(query, resolve)
    })
}

run()
