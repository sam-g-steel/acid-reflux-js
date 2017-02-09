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
        console.log("isLogedIn changed to...", newVal)
    }, "isLogedIn");
    
    // Set time
    store.setState({
        time: Date.now()
    });
    
    // Set time and isLogedIn
    store.setState({
        time: Date.now(),
        isLogedIn: true
    });