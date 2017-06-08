/**
 * Created by sam_g on 2/12/2017.
 */

//let acidRefluxJS = require("acid-reflux-js");
let acidRefluxJS = require("../index");

// Create stores
let store1 = new acidRefluxJS.Store();
let store2 = new acidRefluxJS.Store();

// Subscribe to changes
store1.bindState(store2);

// Set time
store1.setState({
    a: 1
});

// Set
store2.setState({
    a: 1,
    b: 1
});
store1.setState({
    a: 2,
    b: 2
});
store1.setState({
    a: 3,
});

//console.log("History", store1.stateHistory);
//console.log("Full History", store1.getFullHistory());

console.log("\nChange Log1", "\n" + store1.getChangeLog());
console.log("\nChange Log2", "\n" + store2.getChangeLog());


console.log("Full History2", store2.getFullHistory());