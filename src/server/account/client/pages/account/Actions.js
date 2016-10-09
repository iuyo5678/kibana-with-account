var Dispatcher = require('flux-dispatcher');
var Constants = require('./Constants');
var fetch = require('../../helpers/jsonFetch');


var VIEW_ACTION = Constants.PayloadSources.VIEW_ACTION;
var SERVER_ACTION = Constants.PayloadSources.SERVER_ACTION;
var Types = Constants.ActionTypes;
var dispatch = Dispatcher.handleAction;


var Actions = {
  getAccountSettings: function (data) {

    dispatch(VIEW_ACTION, Types.GET_ACCOUNT_SETTINGS, data);

    var request = {
      method: 'GET',
      url: '/api/accounts/my',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      dispatch(SERVER_ACTION, Types.GET_ACCOUNT_SETTINGS_RESPONSE, response);
    });
  },
  saveAccountSettings: function (data) {

    dispatch(VIEW_ACTION, Types.SAVE_ACCOUNT_SETTINGS, data);

    var request = {
      method: 'PUT',
      url: '/api/accounts/my',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.SAVE_ACCOUNT_SETTINGS_RESPONSE, response);
    });
  },
  getUserSettings: function (data) {

    dispatch(VIEW_ACTION, Types.GET_USER_SETTINGS, data);

    var request = {
      method: 'GET',
      url: '/api/users/my',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      dispatch(SERVER_ACTION, Types.GET_USER_SETTINGS_RESPONSE, response);
    });
  },
  saveUserSettings: function (data) {

    dispatch(VIEW_ACTION, Types.SAVE_USER_SETTINGS, data);

    var request = {
      method: 'PUT',
      url: '/api/users/my',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.SAVE_USER_SETTINGS_RESPONSE, response);
    });
  },
  getUserGroupSettings: function (data) {
    dispatch(VIEW_ACTION, Types.GET_USER_GROUP_SETTINGS, data);
    var request = {
      method: 'GET',
      url: '/api/users/group',
      data: data,
      useAuth: true
    };
    fetch(request, function (err, response) {
      if (!err) {
        response.success = true;
      }
      dispatch(SERVER_ACTION, Types.GET_USER_GROUP_SETTINGS_RESPONSE, response);
    });
  },

  saveUserGroupSettings: function (data) {
    dispatch(VIEW_ACTION, Types.SAVE_USER_GROUP_SETTINGS, data);
    var request = {
      method: 'PUT',
      url: '/api/users/group',
      data: data,
      useAuth: true
    };
    fetch(request, function (err, response) {
      if (!err) {
        response.success = true;
      }
      dispatch(SERVER_ACTION, Types.SAVE_USER_GROUP_SETTINGS_RESPONSE, response);
    });
  },

  getAllUserGroupSettings: function (data) {
    dispatch(VIEW_ACTION, Types.GET_ALL_GROUP_SETTINGS, data);
    var request = {
      method: 'GET',
      url: '/api/user-groups',
      data: data,
      useAuth: true
    };
    fetch(request, function (err, response) {
      if (!err) {
        response.success = true;
      }
      dispatch(SERVER_ACTION, Types.GET_ALL_GROUP_SETTINGS_RESPONSE, response);
    });
  },

  savePasswordSettings: function (data) {

    dispatch(VIEW_ACTION, Types.SAVE_PASSWORD_SETTINGS, data);

    if (data.password !== data.passwordConfirm) {
      dispatch(VIEW_ACTION, Types.SAVE_PASSWORD_SETTINGS_RESPONSE, {
        message: 'Passwords do not match.'
      });

      return;
    }

    delete data.passwordConfirm;

    var request = {
      method: 'PUT',
      url: '/api/users/my/password',
      data: data,
      useAuth: true
    };

    fetch(request, function (err, response) {

      if (!err) {
        response.success = true;
      }

      dispatch(SERVER_ACTION, Types.SAVE_PASSWORD_SETTINGS_RESPONSE, response);
    });
  }
};


module.exports = Actions;
