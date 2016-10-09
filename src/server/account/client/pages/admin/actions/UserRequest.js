/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('../constants/UserRequest');
var fetch = require('../../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
  getResults: function (data) {

    dispatch(VIEW_ACTION, Types.GET_RESULTS, data);

    var request = {
      method: 'GET',
      url: '/api/user-request',
      query: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.GET_RESULTS_RESPONSE, response);
    });
  },
  getDetails: function (data) {

    dispatch(VIEW_ACTION, Types.GET_DETAILS, data);

    var request = {
      method: 'GET',
      url: '/api/user-request/' + data.id,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (err) {
        response.fetchFailure = true;
        response.error = err.message;
      }

      dispatch(SERVER_ACTION, Types.GET_DETAILS_RESPONSE, response);
    });
  },

  saveDetails: function (data) {

    dispatch(VIEW_ACTION, Types.SAVE_DETAILS, data);

    var id = data.id;

    var request = {
      method: 'PUT',
      url: '/api/user-request/' + id,
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.SAVE_DETAILS_RESPONSE, response);
    });
  }
};


module.exports = Actions;
