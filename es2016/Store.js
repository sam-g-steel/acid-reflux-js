/**
 * Created by sam_g on 2/7/2017.
 */
import _ from 'lodash';
import areEqual from 'fbjs/lib/areEqual';
/** Simple data store with history recording and on change callbacks */
export class Store {
    constructor() {
        this._boundParents = [];
        this.maxHistoryLength = 32;
        /** @private {function[]} */
        this.onChangeCallbacks = {
            __anyChange: []
        };
        /** @property {object} [state={}] state - An object that represents the present state */
        this.state = {};
        /** @private */
        this.state.__time = Date.now();
        /** @private An array of states from the first to the last, excluding the present state */
        this.stateHistory = [];
    }
    /**
     * Get an array of states from the first to the last
     * @return {object[]} An array of states
     */
    getFullHistory() {
        return _.concat(this.stateHistory, [this.state]);
    }
    trimHistory(length = 32) {
        this.stateHistory = this.stateHistory.slice(-length);
    }
    bindState(stateParent) {
        this._boundParents.push(stateParent);
    }
    unbindState(stateParent) {
        var index = this._boundParents.indexOf(stateParent);
        if (index > -1) {
            this._boundParents.splice(index, 1);
        }
    }
    fowardState(stateParent) {
        let keys = _.intersection(Object.keys(stateParent.state), Object.keys(this.state));
        let newState = {};
        keys.forEach(key => newState[key] = this.state[key]);
        stateParent.setState(newState);
    }
    fowardToBoundStates() {
        this._boundParents.forEach(parent => this.fowardState(parent));
    }
    /**
     * Get the previous state of the store
     * @return {object} previous state
     */
    getPreviousState() {
        let index = this.stateHistory.length - 1;
        return this.stateHistory[index];
    }
    /**
     * Set the store's state and optionally save the last state to history
     * @param {object} newState
     * @param {boolean} historyMode
     * @example <caption>Set state and record previous state to history</caption>
     * myStore.setState({userName: "John Doe"});
     * @example <caption>Set state and forget about recording previous state to history</caption>
     * myStore.setState({userName: "Billy Bob", false});
     */
    setState(newState, historyMode = true) {
        // Save the old state
        let oldState = this.state;
        // Update the state
        this.state = _.assign({}, oldState, newState);
        let changes = Store.getChangeList(oldState, this.state);
        this.trimHistory(this.maxHistoryLength);
        // Loop through list of changes and trigger their respective callbacks
        changes.forEach((o) => {
            // Get the name of the changed property
            let { property } = o;
            // Get the new and old values of the property
            let newProperty = this.state[property];
            let oldProperty = oldState[property];
            // Trigger the property's callback
            this._triggerChangeCallbacks(property, newProperty, oldProperty);
        });
        if (changes.length) {
            //
            this.state.__time = Date.now();
            if (historyMode == true) {
                this.stateHistory.push(oldState);
            }
            this._triggerChangeCallbacks("__anyChange", this.state, oldState);
            this.fowardToBoundStates();
        }
    }
    /**
     * Subscribe to changes in the state
     * @param {function(newValue: *, oldValue: *)} callback
     * @param {string} property - Name of the property to watch
     * @example <caption>Trigger callback when userName is updated</caption>
     * myStore.subscribeToChanges((newVal)=>{ console.log("userName changed to...", newVal)}, "userName");
     */
    subscribeToChanges(callback, property = "__anyChange") {
        if (this.onChangeCallbacks[property] == undefined)
            this.onChangeCallbacks[property] = [];
        if (typeof callback != "function") {
            console.error("Callback given is not a function as expected");
        }
        else {
            this.onChangeCallbacks[property].push(callback);
        }
    }
    /**
     * Remove subscription to changes in the state
     * @param {function} callback
     * @param {string} property - Name of the property to unsubscribe from
     */
    unSubscribeToChanges(callback, property = "__anyChange") {
        let callbackList = this.onChangeCallbacks[property];
        if (callbackList == undefined)
            return;
        this.onChangeCallbacks[property] = _.pull(callbackList, callback);
    }
    /**
     *
     * @param {object} oldState
     * @param {object} newState
     * @return {Array}
     */
    static getChangeList(oldState, newState) {
        // Loop through state properties looking for changes
        let changes = [];
        for (let property in newState) {
            let newProperty = newState[property];
            let oldProperty = oldState[property];
            if (property == "__time")
                continue;
            // Generate change list
            if (!areEqual(newProperty, oldProperty)) {
                changes.push({
                    property: property,
                    isNew: oldProperty == undefined || oldProperty == null
                });
            }
        }
        return changes;
    }
    /**
     *
     * @param {object} oldState
     * @param {object} newState
     * @return {string}
     */
    static getChangeLog(oldState, newState) {
        let changes = this.getChangeList(oldState, newState);
        let log = changes.map((o) => {
            if (o.isNew)
                return `Added new property "${o.property}"`;
            else
                return `Changed value of "${o.property}"`;
        });
        return log.join("\n");
    }
    _triggerChangeCallbacks(property, newValue, oldValue) {
        if (!this.onChangeCallbacks[property])
            return;
        this.onChangeCallbacks[property].forEach((callback) => callback(newValue, oldValue, property));
    }
    getChangeLog() {
        let fullHistory = this.getFullHistory();
        let changes = [];
        fullHistory.forEach((o, i) => {
            if (i == 0)
                return;
            changes.push(Store.getChangeLog(fullHistory[i - 1], o));
        });
        return changes.join("\n------------\n");
    }
}
export default Store;
//# sourceMappingURL=Store.js.map