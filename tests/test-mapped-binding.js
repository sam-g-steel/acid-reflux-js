/**
 * Created by sam_g on 2/12/2017.
 */

//let acidRefluxJS = require("acid-reflux-js");
let acidRefluxJS = require("../index");

// Create stores
let mainStore = new acidRefluxJS.Store();
let petStore = new acidRefluxJS.Store({name: null});

// Subscribe to changes
mainStore.bindState(petStore, key=>{
    let map = {
        petName: "name"
    };
    return map[key];
});

//
mainStore.setState({
    personName: "Bertha Grossman",
    petName: "FooFoo",
});

mainStore.setState({
    personName: "Mark Kibbler",
    petName: "ArfArf",
});

//console.log("History", mainStore.stateHistory);
//console.log("Full History", mainStore.getFullHistory());

console.log("\nChange Log 1", "\n" + mainStore.getChangeLog());
console.log("\nChange Log 2", "\n" + petStore.getChangeLog());


console.log("Full History 2", petStore.getFullHistory());