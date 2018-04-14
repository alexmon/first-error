/**
 * Proof of concept
 * Chain async function calls, and report first error
 * @author Alexandros Monastiriotis <alex.monastiriotis@gmail.com>
 */

/**
 * mock async call which returns a promise
 * if args last arg belongs to errorIndices returns rejected promise
 * 
 * @param {*} args 
 * @returns {Promise}
 */
function serviceCall(...args) {
    const i = args[args.length - 1];
    const searchIndiceRegEx = new RegExp(`${i}`);
    if (searchIndiceRegEx.test(errorIndices)) {
        return Promise.reject(new Error(`[error] function call ${i}`));
    }
    return Promise.resolve(args);
}

/**
 * Call and return serviceCall, procides error handling
 * 
 * @param {*} f 
 * @param {*} args 
 * @param {*} i
 * @returns {Promise}
 */
function serviceCallWrapper(f, args, i) {
    return f(...args)
        .then(
            (res) => {
                printResult(args, i);
                return res;
            }
        )
        .catch(
            (err) => {
                // replace indice with 'error' string to indicate error
                args[args.length - 1] = 'error';
                printResult(args, i);
                if (errorCounterGenerator.next().value == 1) {
                    console.error(err);
                } 
                return args;
            }
        );
}

/**
 * use a generator to hold the number of error occurences happened
 * @param {*} init 
 */
function* countErrors() {
    let errorCounter = 0;
    while (true) {
        yield ++errorCounter;
    }    
}


/**
 * prints friendly message
 * @param {*} res 
 * @param {*} i 
 */
function printResult(res, i) {
    console.log(`[function call (${i})]: ${res}`);
}

// first argument is the total number of functions
let totalFunctionsNumber = Number.parseInt(process.argv[2]);
// third argument provides the error indices, zero based, comma separated
let errorIndices = process.argv[3];
// create array of functions to call
let functionsExecutionPlan = [];
Array.from(new Array(totalFunctionsNumber)).forEach(
    (v, i) => {
        functionsExecutionPlan.push(serviceCall);            
    }
);
// error counter generator
let errorCounterGenerator = countErrors();

// reduce over functions array to chain calls, accumulator is a resolved empty array promise 
functionsExecutionPlan.reduce(
    (acc, v, i) => {
        return acc
            .then(
                (res) => {
                    // provide last result to next function call
                    return serviceCallWrapper(v, [...res, i], i);
                }
            );
    },
    Promise.resolve([])
);