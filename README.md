# promise-option

Take a function that accepts a callback as it's last parameter and makes it so that you can use the callback paradigm or the promise paradigm on the function.

## Installation

```sh
npm install promise-option
```

## Usage Example

```js
var fs = require('fs');
var promiseOption = require('promise-option');
var readFile = promiseOption(fs.readFile);

// still use callback paradigm
readFile('./file.txt', 'utf8').callback(function(err, content) {
    if (err) {
        console.error(err.stack);    
    } else {
        console.log(content);
    }
});

// use the promise paradigm
readFile('./file.txt', 'utf8')
    .then(function(content) {
        console.log(content);
    });
    .catch(function(err) {
        console.error(err.stack); 
    });
```

## API

#### promiseOption ( [ scope, ] [ multiArgs, ] fnEnclosed )

**Parameters**

- **scope** - This optional parameter specifies the scope that the function should be called with. If the function is a property of an object, then you'll want to pass that object in as the first parameter.
- **multiArgs** - If the callback takes more than two arguments (error and value) then you can set this value to true to have the promisified response resolve to an array of values instead of a single resolved value or a single rejected reason.
- **fnEnclosed** - This required parameter is the function to wrap.

**Returns** a function that can be called in place of the provided callback. This new function can be called using the callback paradigm or the promise paradigm.

### Callbacks vs Promises

**TL;DR** - For **high performance** use callbacks, for **complex asynchronous data flow** use promises.

There are a variety of pros and cons for why you would use a callback over a promise and vice versa, but the biggest factors in my opinion come down to what your highest priority is. If your priority is very high performance then stick with callbacks. If you have a complex interweave of multiple asynchronous functions that you are trying to manage the flow of data between then use promises to simplify the
asynchronous data flow.