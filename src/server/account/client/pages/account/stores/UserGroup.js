var Dispatcher = require('flux-dispatcher');
var FluxStore = require('flux-store');
var CloneDeep = require('lodash/lang/cloneDeep');
var Constants = require('../Constants');
var ParseValidation = require('../../../helpers/parseValidation');


var ActionTypes = Constants.ActionTypes;


var Store = FluxStore.extend({
    dispatcher: Dispatcher,
    state: {},
    defaultState: {
        hydrated: false,
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

        this.state = CloneDeep(this.defaultState);
    },
    setLoadingState: function () {

        this.state.loading = true;
        this.state.success = false;
        this.state.error = undefined;
        this.state.hasError = {};
        this.state.help = {};
    },
    handleResponseErrors: function (data) {

        var validation = ParseValidation(data.validation, data.message);
        var self = this;

        this.state.loading = false;
        this.state.success = data.success;
        if (this.state.success) {
            setTimeout(function () {

                self.state.success = undefined;
                self.emitChange();
            }, 2500);
        }

        this.state.hasError = validation.hasError;
        this.state.help = validation.help;
        this.state.error = validation.error;
    },
    onDispatcherAction: function (payload) {

        var action = payload.action;

        if(ActionTypes.GET_ALL_GROUP_SETTINGS === action.type) {
            this.setLoadingState();
            this.state.hydrated = false;
            this.emitChange();
        }

        if(ActionTypes.GET_ALL_GROUP_SETTINGS_RESPONSE === action.type) {
            var validation = ParseValidation(action.data.validation, action.data.message);

            this.state.loading = false;
            this.state.hasError = validation.hasError;
            this.state.help = validation.help;
            this.state.error = validation.error;

            this.state.hydrated = true;
            this.state.userGroup = action.data.data;
            this.emitChange();
        }

        if (ActionTypes.SAVE_USER_GROUP_SETTINGS === action.type) {
            this.setLoadingState();
            this.emitChange();
        }

        if (ActionTypes.SAVE_USER_GROUP_SETTINGS_RESPONSE === action.type) {
            this.handleResponseErrors(action.data);
            var self = this;
            if (this.state.error) {
                setTimeout(function () {
                    self.state.error = undefined;
                    self.emitChange();
                }, 1000);
            }
            this.emitChange();
        }
    }
});


module.exports = Store;
