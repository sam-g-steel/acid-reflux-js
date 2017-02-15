/**
 * Created by sam_g on 2/12/2017.
 */
//let acidRefluxJS = require("acid-reflux-js");
let acidRefluxJS = require("../index");

// Create store
let store = new acidRefluxJS.Store();

// Subscribe to changes
store.subscribeToChanges((newState, oldState)=>{
    console.log("on any change", newState)
});

store.subscribeToChanges((newVal, oldVal)=>{
    console.log("isLoggedIn changed to...", newVal)
}, "isLoggedIn");

// Set time
store.setState({
    time: Date.now()
});

// Set time and isLoggedIn
store.setState({
    time: Date.now(),
    isLoggedIn: true
});

console.log("History", store.stateHistory);
console.log("Full History", store.getFullHistory());

console.log("Change Log", store.getChangeLog());