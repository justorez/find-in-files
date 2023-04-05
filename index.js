import fs from 'fs'
import readline from 'readline'
import finder from 'find'
import pLimit from 'p-limit'
import globToRegexp from 'glob-to-regexp'

/**
 * @param {RegExp|string} pattern
 * @param {string} flags
 */
function re(pattern, flags = 'g') {
    if (pattern instanceof RegExp) {
        flags = pattern.flags
    }
    if (!flags.includes('g')) {
        flags += 'g'
    }
    return new RegExp(pattern, flags)
}

/**
 * @param {string} file
 * @param {RegExp|string} pattern 
 */
function searchContent(file, pattern) {
    return new Promise((resolve) => {
        const matches = []
        const lines = []
        pattern = re(pattern)

        const rl = readline.createInterface({
            input: fs.createReadStream(file)
        })
        rl.on('line', (line) => {
            const result = line.match(pattern)
            if (result) {
                matches.push(...result)
                lines.push(line)
            }
        })
        rl.on('close', () => {
            if (matches.length === 0) return resolve(null)
            resolve({
                filename: file,
                matches,
                lines
            })
        })
    })
}

/**
 * @typedef {Object} FindResult
 * @property {string} FindResult.filename
 * @property {string[]} FindResult.matches
 * @property {string[]} FindResult.lines
 */

/**
 * @param {PromiseSettledResult[]} values
 * @returns {FindResult[]}
 */
function getResults(values) {
    return values.map((v) => v.value).filter((v) => v)
}

/**
 * @param {string|RegExp} pattern 搜索目标的文本模式
 * @param {string} directory 搜索指定目录下的文件
 * @param {string|RegExp} fileFilter 仅在符合条件的文件中搜索
 * @returns {Promise<FindResult[]>}
 */
function find(pattern, directory, fileFilter = '*') {
    return new Promise((resolve, reject) => {
        if (typeof fileFilter === 'string') {
            fileFilter = globToRegexp(fileFilter, { extended: true })
        }
        finder
            .file(fileFilter, directory, (files) => {
                const limit = new pLimit(20)
                const input = files.map((file) => limit(() => searchContent(file, pattern)))
                Promise.allSettled(input).then(getResults).then(resolve)
            })
            .error(reject)
    })
}

export default {
    find
}
