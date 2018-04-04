/** Simple data store with history recording and on change callbacks */
export declare class Store {
    /***
     *
     * @ignore
     * @type {any[]}
     * @private
     */
    private _boundStates;
    onChangeCallbacks: any;
    maxHistoryLength: number;
    state: any;
    private stateHistory;
    /***
     * Creates a store and sets its initial state to the optional value passed in
     * @param state
     */
    constructor(state?: any);
    /**
     * Get an array of states from the first to the last
     * @return {object[]} An array of states
     */
    getFullHistory(): any;
    /**
     * Trims the history down to the last 'x' number of entries
     * @param {number} length - max number of state history entries
     */
    trimHistory(length?: number): void;
    /***
     * Automaticly updates the state of stateParent
     * @example <caption>Binding to a React component</caption>
     * componentDidMount(){
     *     // Don't forget to unbind on unmount
     *     mainStore.bindState(this);
     * }
     * @param stateParent
     * @param {function} mapping - (string)=>string
     * @param {boolean} forward
     */
    bindState(stateParent: any, mapping?: (string) => string, forward?: boolean): void;
    /***
     * Unbinds the state of stateParent
     * @example <caption>Unbinding to a React component</caption>
     * componentWillUnmount(){
     *     mainStore.unbindState(this);
     * }
     * @param stateParent
     */
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
     * Returns difference between two states in human readable form
     * @param {object} oldState
     * @param {object} newState
     * @return {string}
     */
    static getChangeLog(oldState: any, newState: any): string;
    /***
     *
     * @ignore
     * @param property
     * @param newValue
     * @param oldValue
     * @private
     */
    _triggerChangeCallbacks(property: any, newValue: any, oldValue: any): void;
    /**
     * Returns change log of entire history in human readable form
     * @return {string}
     */
    getChangeLog(): string;
}
export default Store;
