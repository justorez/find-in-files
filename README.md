# jfind

Search the content of all files located within a designated directory.

## Usage

### Command Line

```sh
pnpm i @orez/jfind -g
```

Find "hello" in all txt files in the current directory, and ignore case sensitivity.

```sh
jfind . -p hello -f *.txt -i
```

Complex matching rules

The command line cannot directly input complex regular expressions. So, don't set `p`, instead of whole line input.

```sh
jfind . -f *.txt -i
Input complex pattern: ^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
```

### Module

```sh
pnpm i @orez/jfind -S
```

```js
import jfind from '@orez/jfind'

jfind.find(/hello/ig, '.', '*.txt')
    .then(results => console.log(results))

// results
[
  {
    filename: 'test\\2.txt',
    matches: [ 'Hello' ],
    lines: [ "Hello! I'm justorez." ]
  }
]
```
