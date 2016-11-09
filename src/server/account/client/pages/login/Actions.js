/* global window */
var Dispatcher = require('flux-dispatcher');
var Constants = require('./Constants');
var fetch = require('../../helpers/jsonFetch');
var RedirectActions = require('../../actions/Redirect');

var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;

var cookie = require('react-cookie');

var Actions = {
  forgot: function (data) {

    dispatch(VIEW_ACTION, Types.FORGOT, data);

    var request = {
      method: 'POST',
      url: '/api/login/forgot',
      data: data
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.FORGOT_RESPONSE, response);
    });
  },
  login: function (data) {

    dispatch(VIEW_ACTION, Types.LOGIN, data);

    var request = {
      method: 'POST',
      url: '/api/login',
      data: data
    };

    fetch(request, function (err, response) {

      if (!err) {
        var returnUrl = window.localStorage.getItem('returnUrl');

        if (returnUrl) {
          RedirectActions.clearReturnUrl();
          window.location.href = returnUrl;
        }
        else if (response.user.role.name === 'root') {

          window.location.href = '/kibana-admin';
        }
        else {
          cookie.save('index', response.user.index);
          window.location.href = '/';
        }

        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.LOGIN_RESPONSE, response);
    });
  },
  logout: function (data) {

    dispatch(VIEW_ACTION, Types.LOGOUT, data);

    var request = {
      method: 'DELETE',
      url: '/api/logout',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        cookie.remove('index');
        response.success = true;
      }
      else {
        response.error = err.message;
      }

      dispatch(SERVER_ACTION, Types.LOGOUT_RESPONSE, response);
    });
  },
  reset: function (data) {

    dispatch(VIEW_ACTION, Types.RESET, data);

    var request = {
      method: 'POST',
      url: '/api/login/reset',
      data: data
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.RESET_RESPONSE, response);
    });
  }
};


module.exports = Actions;
