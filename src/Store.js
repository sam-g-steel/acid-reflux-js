/**
 * Created by sam_g on 2/7/2017.
 */
import _ from 'lodash';
import areEqual from 'fbjs/lib/areEqual';

export class Store{
    constructor(){
        this.onChangeCallbacks = {
            __anyChange: []
        };
        this.state = {
            __time: Date.now()
        };
        this.stateHistory = [];
    }

    getFullHistory(){
        return _.concat(this.stateHistory, [this.state]);
    }

    getPreviousState(){
        let index = this.stateHistory.length - 1;

        return this.stateHistory[index];
    }

    setState(newState, historyMode = true){

        // Save the old state
        let oldState = this.state;

        // Update the state
        this.state = _.assign({}, oldState, newState);

        // Loop through state properties looking for changes
        let anyChanges = false;
        for(let property in this.state){
            let newProperty = this.state[property];
            let oldProperty = oldState[property];

            // If there is a change trigger the properties change callbacks
            if(!areEqual(newProperty, oldProperty)){
                this.triggerChangeCallbacks(property, newProperty, oldProperty);
                anyChanges = true;
            }
        }

        if(anyChanges){
            //
            this.state.__time = Date.now();

            if(historyMode == true){
                this.stateHistory.push(oldState);
            }

            this.triggerChangeCallbacks("__anyChange", this.state, oldState);
        }
    }

    subscribeToChanges(callback, property = "__anyChange"){
        if(this.onChangeCallbacks[property] == undefined) this.onChangeCallbacks[property] = [];

        if(typeof callback != "function"){
            console.error("Callback given is not a function as expected");
        }else {
            this.onChangeCallbacks[property].push(callback);
        }
    }

    triggerChangeCallbacks(property, newValue, oldValue){
        if(!this.onChangeCallbacks[property]) return;

        this.onChangeCallbacks[property].forEach((callback)=>callback(newValue, oldValue, property));
    }

    unSubscribeToChanges(callback, property = "__anyChange"){
        let callbackList = this.onChangeCallbacks[property];
        if(callbackList == undefined) return;

        this.onChangeCallbacks[property] = _.pull(callbackList, callback);
    }
}

export default Store;