/**
 * Created by sam_g on 2/7/2017.
 */
import _ from 'lodash';

export class Store{
    constructor(){
        this.onChangeCallbacks = {
            __anyChange: []
        };
        this.state = {};
        this.stateHistory = [];
    }

    getPreviousState(){
        let index = this.stateHistory.length - 1;

        return this.stateHistory[index];
    }

    triggerChangeCallbacks(property, newValue, oldValue){
        if(!this.onChangeCallbacks[property]) return;

        this.onChangeCallbacks[property].forEach((callback)=>callback(property, newValue, oldValue));
    }

    setState(newState){
        // Save the old state
        let oldState = this.state;
        this.stateHistory.push(oldState);

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
}

export default Store;