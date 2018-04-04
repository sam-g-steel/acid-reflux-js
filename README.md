# acid-reflux-js
A simple library for uni-directional dataflow application architecture... inspired by Flux and Redux

[![npm version](https://badge.fury.io/js/acid-reflux-js.svg)](https://badge.fury.io/js/acid-reflux-js)

See more in depth docs [here](https://sam-g-steel.github.io/acid-reflux-js/)

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
    
#Latest Changes



**v0.3.1**
Updating docs


**v0.3.0**

Added state mapping
More docs on this later


**v0.2.0**

Added State.maxHistoryLength
Added state binding


**v0.1.7**

Added more docs using ESdoc [wip]



**v0.1.6**

Updated Change Log functions... internal property "__time" is now ignored

Log looks cleaner


**v0.1.5**

Added Change Log functions... More to come in the docs!


**v0.1.4**

Improved changed detection, now if a state property changes from one object to another that is identical, no change is registered

#Future Plans

- More Docs
- State change playback mode