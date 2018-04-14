# first-error
test chain async function calls and report first error

run:
node index.js 5 1,2

```
[function call (0)]: 0
[function call (1)]: 0,error
Error: [error] function call 1
    at serviceCall (/Users/alex/Projects/first-error/index.js:18:31)
    at serviceCallWrapper (/Users/alex/Projects/first-error/index.js:32:12)
    at acc.then (/Users/alex/Projects/first-error/index.js:94:28)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
    at Function.Module.runMain (module.js:686:11)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
[function call (2)]: 0,error,error
[function call (3)]: 0,error,error,3
[function call (4)]: 0,error,error,3,4
```