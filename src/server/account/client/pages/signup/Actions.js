/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('./Constants');
var fetch = require('../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;

var cookie = require('react-cookie');

var Actions = {
  sendRequest: function (data) {

    dispatch(VIEW_ACTION, Types.SEND_REQUEST, data);

    var request = {
      method: 'POST',
      url: '/api/signup',
      data: data
    };

    fetch(request, function (err, response) {

      if (!err) {
        cookie.save('index', response.user.index);
        window.location.href = '/account';
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.RECEIVE_RESPONSE, response);
    });
  }
};


module.exports = Actions;
