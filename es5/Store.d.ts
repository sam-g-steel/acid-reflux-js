/** Simple data store with history recording and on change callbacks */
export declare class Store {
    private _boundStates;
    onChangeCallbacks: any;
    maxHistoryLength: number;
    state: any;
    private stateHistory;
    constructor();
    /**
     * Get an array of states from the first to the last
     * @return {object[]} An array of states
     */
    getFullHistory(): any;
    trimHistory(length?: number): void;
    bindState(stateParent: any, mapping?: (string) => string, forward?: boolean): void;
    unbindState(stateParent: any): void;
    forwardState(receivingStateParent: any, mapping?: (string) => string): void;
    private forwardToBoundStates();
    /**
     * Get the previous state of the store
     * @return {object} previous state
     */
    getPreviousState(): any;
    /**
     * Set the store's state and optionally save the last state to history
     * @param {object} newState
     * @param {boolean} historyMode
     * @example <caption>Set state and record previous state to history</caption>
     * myStore.setState({userName: "John Doe"});
     * @example <caption>Set state and forget about recording previous state to history</caption>
     * myStore.setState({userName: "Billy Bob", false});
     */
    setState(newState: any, historyMode?: boolean): void;
    /**
     * Subscribe to changes in the state
     * @param {function(newValue: *, oldValue: *)} callback
     * @param {string} property - Name of the property to watch
     * @example <caption>Trigger callback when userName is updated</caption>
     * myStore.subscribeToChanges((newVal)=>{ console.log("userName changed to...", newVal)}, "userName");
     */
    subscribeToChanges(callback: any, property?: string): void;
    /**
     * Remove subscription to changes in the state
     * @param {function} callback
     * @param {string} property - Name of the property to unsubscribe from
     */
    unSubscribeToChanges(callback: any, property?: string): void;
    /**
     *
     * @param {object} oldState
     * @param {object} newState
     * @return {Array}
     */
    static getChangeList(oldState: any, newState: any): any[];
    /**
     *
     * @param {object} oldState
     * @param {object} newState
     * @return {string}
     */
    static getChangeLog(oldState: any, newState: any): string;
    _triggerChangeCallbacks(property: any, newValue: any, oldValue: any): void;
    getChangeLog(): string;
}
export default Store;
