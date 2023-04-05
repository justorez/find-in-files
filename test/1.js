import jfind from '../index.js'

// 'hello world'
jfind.find(/hello/ig, '.', '*.txt')
    .then(console.log)