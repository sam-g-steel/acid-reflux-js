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

        let changes = Store.getChangeList(oldState, this.state);

        // Loop through list of changes and trigger their respective callbacks
        changes.forEach((o)=>{
            // Get the name of the changed property
            let {property} = o;

            // Get the new and old values of the property
            let newProperty = this.state[property];
            let oldProperty = oldState[property];

            // Trigger the property's callback
            this._triggerChangeCallbacks(property, newProperty, oldProperty);
        });

        if(changes.length){
            //
            this.state.__time = Date.now();

            if(historyMode == true){
                this.stateHistory.push(oldState);
            }

            this._triggerChangeCallbacks("__anyChange", this.state, oldState);
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

    unSubscribeToChanges(callback, property = "__anyChange"){
        let callbackList = this.onChangeCallbacks[property];
        if(callbackList == undefined) return;

        this.onChangeCallbacks[property] = _.pull(callbackList, callback);
    }

    static getChangeList(oldState, newState){
        // Loop through state properties looking for changes
        let changes = [];
        for(let property in newState){
            let newProperty = newState[property];
            let oldProperty = oldState[property];

            if(property == "__time") continue;

            // Generate change list
            if(!areEqual(newProperty, oldProperty)){
                changes.push({
                    property: property,
                    isNew: oldProperty == undefined || oldProperty == null
                });
            }
        }

        return changes;
    }

    static getChangeLog(oldState, newState){
        let changes = this.getChangeList(oldState, newState);
        let log = changes.map((o)=>{
            if(o.isNew) return`Added new property "${o.property}"`;
            else return`Changed value of "${o.property}"`;
        });


        return log.join("\n");
    }

    _triggerChangeCallbacks(property, newValue, oldValue){
        if(!this.onChangeCallbacks[property]) return;

        this.onChangeCallbacks[property].forEach((callback)=>callback(newValue, oldValue, property));
    }

    getChangeLog(){
        let fullHistory = this.getFullHistory();
        let changes = [];

        fullHistory.forEach((o, i)=>{
            if(i == 0) return;

            changes.push(Store.getChangeLog(fullHistory[i-1], o));
        });

        return changes.join("\n------------\n");
    }
}

export default Store;