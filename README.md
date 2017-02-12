# acid-reflux-js
A simple library for uni-directional dataflow application architecture... inspired by Flux and Redux

[![npm version](https://badge.fury.io/js/acid-reflux-js.svg)](https://badge.fury.io/js/acid-reflux-js)

Example code...

    var acidRefluxJS = require("acid-reflux-js")
    
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
    
    console.log("Full History", store.getFullHistory());