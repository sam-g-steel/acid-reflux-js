"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by sam_g on 2/7/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = exports.Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.onChangeCallbacks = {
            __anyChange: []
        };
        this.state = {
            __time: Date.now()
        };
        this.stateHistory = [];
    }

    _createClass(Store, [{
        key: "getFullHistory",
        value: function getFullHistory() {
            return _lodash2.default.concat(this.stateHistory, [this.state]);
        }
    }, {
        key: "getPreviousState",
        value: function getPreviousState() {
            var index = this.stateHistory.length - 1;

            return this.stateHistory[index];
        }
    }, {
        key: "setState",
        value: function setState(newState) {
            var historyMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            //
            newState.__time = Date.now();

            // Save the old state
            var oldState = this.state;

            if (historyMode == true) {
                this.stateHistory.push(oldState);
            }

            // Update the state
            this.state = _lodash2.default.assign({}, this.state, newState);

            // Generate list of shallow changes
            var anyChanges = false;
            for (var property in this.state) {
                var newProperty = this.state[property];
                var oldProperty = oldState[property];
                if (newProperty !== oldProperty) {
                    // changes.push(property);
                    this.triggerChangeCallbacks(property, newProperty, oldProperty);
                    anyChanges = true;
                }
            }

            if (anyChanges) this.triggerChangeCallbacks("__anyChange", this.state, oldState);
        }
    }, {
        key: "subscribeToChanges",
        value: function subscribeToChanges(callback) {
            var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "__anyChange";

            if (this.onChangeCallbacks[property] == undefined) this.onChangeCallbacks[property] = [];

            if (typeof callback != "function") {
                console.error("Callback given is not a function as expected");
            } else {
                this.onChangeCallbacks[property].push(callback);
            }
        }
    }, {
        key: "triggerChangeCallbacks",
        value: function triggerChangeCallbacks(property, newValue, oldValue) {
            if (!this.onChangeCallbacks[property]) return;

            this.onChangeCallbacks[property].forEach(function (callback) {
                return callback(newValue, oldValue, property);
            });
        }
    }, {
        key: "unSubscribeToChanges",
        value: function unSubscribeToChanges(callback) {
            var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "__anyChange";

            var callbackList = this.onChangeCallbacks[property];
            if (callbackList == undefined) return;

            this.onChangeCallbacks[property] = _lodash2.default.pull(callbackList, callback);
        }
    }]);

    return Store;
}();

exports.default = Store;
//# sourceMappingURL=Store.js.map