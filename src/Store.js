/**
 * Created by sam_g on 2/7/2017.
 */
import _ from 'lodash';

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
        //
        newState.__time = Date.now();

        // Save the old state
        let oldState = this.state;

        if(historyMode == true){
            this.stateHistory.push(oldState);
        }

        // Update the state
        this.state = _.assign({}, this.state, newState);

        // Generate list of shallow changes
        let anyChanges = false;
        for(let property in this.state){
            let newProperty = this.state[property];
            let oldProperty = oldState[property];
            if(newProperty !== oldProperty){
                // changes.push(property);
                this.triggerChangeCallbacks(property, newProperty, oldProperty);
                anyChanges = true;
            }
        }

        if(anyChanges) this.triggerChangeCallbacks("__anyChange", this.state, oldState);
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