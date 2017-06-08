'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by sam_g on 2/7/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _areEqual = require('fbjs/lib/areEqual');

var _areEqual2 = _interopRequireDefault(_areEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Simple data store with history recording and on change callbacks */
var Store = exports.Store = function () {
    function Store() {
        _classCallCheck(this, Store);

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


    _createClass(Store, [{
        key: 'getFullHistory',
        value: function getFullHistory() {
            return _lodash2.default.concat(this.stateHistory, [this.state]);
        }
    }, {
        key: 'trimHistory',
        value: function trimHistory() {
            var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;

            this.stateHistory = this.stateHistory.slice(-length);
        }
    }, {
        key: 'bindState',
        value: function bindState(stateParent) {
            this._boundParents.push(stateParent);
        }
    }, {
        key: 'unbindState',
        value: function unbindState(stateParent) {
            var index = this._boundParents.indexOf(stateParent);
            if (index > -1) {
                this._boundParents.splice(index, 1);
            }
        }
    }, {
        key: 'fowardState',
        value: function fowardState(stateParent) {
            var _this = this;

            var keys = _lodash2.default.intersection(Object.keys(stateParent.state), Object.keys(this.state));
            var newState = {};
            keys.forEach(function (key) {
                return newState[key] = _this.state[key];
            });
            stateParent.setState(newState);
        }
    }, {
        key: 'fowardToBoundStates',
        value: function fowardToBoundStates() {
            var _this2 = this;

            this._boundParents.forEach(function (parent) {
                return _this2.fowardState(parent);
            });
        }
        /**
         * Get the previous state of the store
         * @return {object} previous state
         */

    }, {
        key: 'getPreviousState',
        value: function getPreviousState() {
            var index = this.stateHistory.length - 1;
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

    }, {
        key: 'setState',
        value: function setState(newState) {
            var _this3 = this;

            var historyMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            // Save the old state
            var oldState = this.state;
            // Update the state
            this.state = _lodash2.default.assign({}, oldState, newState);
            var changes = Store.getChangeList(oldState, this.state);
            this.trimHistory(this.maxHistoryLength);
            // Loop through list of changes and trigger their respective callbacks
            changes.forEach(function (o) {
                // Get the name of the changed property
                var property = o.property;
                // Get the new and old values of the property

                var newProperty = _this3.state[property];
                var oldProperty = oldState[property];
                // Trigger the property's callback
                _this3._triggerChangeCallbacks(property, newProperty, oldProperty);
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

    }, {
        key: 'subscribeToChanges',
        value: function subscribeToChanges(callback) {
            var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "__anyChange";

            if (this.onChangeCallbacks[property] == undefined) this.onChangeCallbacks[property] = [];
            if (typeof callback != "function") {
                console.error("Callback given is not a function as expected");
            } else {
                this.onChangeCallbacks[property].push(callback);
            }
        }
        /**
         * Remove subscription to changes in the state
         * @param {function} callback
         * @param {string} property - Name of the property to unsubscribe from
         */

    }, {
        key: 'unSubscribeToChanges',
        value: function unSubscribeToChanges(callback) {
            var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "__anyChange";

            var callbackList = this.onChangeCallbacks[property];
            if (callbackList == undefined) return;
            this.onChangeCallbacks[property] = _lodash2.default.pull(callbackList, callback);
        }
        /**
         *
         * @param {object} oldState
         * @param {object} newState
         * @return {Array}
         */

    }, {
        key: '_triggerChangeCallbacks',
        value: function _triggerChangeCallbacks(property, newValue, oldValue) {
            if (!this.onChangeCallbacks[property]) return;
            this.onChangeCallbacks[property].forEach(function (callback) {
                return callback(newValue, oldValue, property);
            });
        }
    }, {
        key: 'getChangeLog',
        value: function getChangeLog() {
            var fullHistory = this.getFullHistory();
            var changes = [];
            fullHistory.forEach(function (o, i) {
                if (i == 0) return;
                changes.push(Store.getChangeLog(fullHistory[i - 1], o));
            });
            return changes.join("\n------------\n");
        }
    }], [{
        key: 'getChangeList',
        value: function getChangeList(oldState, newState) {
            // Loop through state properties looking for changes
            var changes = [];
            for (var property in newState) {
                var newProperty = newState[property];
                var oldProperty = oldState[property];
                if (property == "__time") continue;
                // Generate change list
                if (!(0, _areEqual2.default)(newProperty, oldProperty)) {
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

    }, {
        key: 'getChangeLog',
        value: function getChangeLog(oldState, newState) {
            var changes = this.getChangeList(oldState, newState);
            var log = changes.map(function (o) {
                if (o.isNew) return 'Added new property "' + o.property + '"';else return 'Changed value of "' + o.property + '"';
            });
            return log.join("\n");
        }
    }]);

    return Store;
}();

exports.default = Store;
//# sourceMappingURL=Store.js.map
//# sourceMappingURL=Store.js.map