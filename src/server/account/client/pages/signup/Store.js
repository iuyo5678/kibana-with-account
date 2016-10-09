var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var cloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('./Constants');
var parseValidation = require('../../helpers/parseValidation');


var ActionTypes = Constants.ActionTypes;


var Store = FluxStore.extend({
  dispatcher: Dispatcher,
  state: {},
  defaultState: {
    loading: false,
    success: false,
    error: undefined,
    hasError: {},
    help: {}
  },
  getState: function () {

    return this.state;
  },
  reset: function () {

    this.state = cloneDeep(this.defaultState);
  },
  onDispatcherAction: function (payload) {

    var action = payload.action;

    if (ActionTypes.SEND_REQUEST === action.type) {
      this.state.loading = true;
      this.state.success = false;
      this.state.error = undefined;
      this.state.hasError = {};
      this.state.help = {};
      this.emitChange();
    }

    if (ActionTypes.RECEIVE_RESPONSE === action.type) {
      var validation = parseValidation(action.data.validation, action.data.message);

      this.state.loading = false;
      this.state.success = action.data.success;
      this.state.hasError = validation.hasError;
      this.state.help = validation.help;
      this.state.error = validation.error;

      this.emitChange();
    }
  }
});


module.exports = Store;
