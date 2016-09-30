/**
 * Created by wls81 on 9/23/16.
 */
var wreck = require('wreck');
var createKibanaIndex = require('./create_kibana_index');

module.exports = function preProcessResponse(server) {
  return function(err, res, request, reply, settings, ttl) {
    if (err) {
      reply(err).code(500);
    }

    wreck.read(res, { json: true }, function (err, payload) {
      // console.log(payload);
      if (payload.docs && payload.docs[0].error && payload.docs[0].error.type == "index_not_found_exception") {
        createKibanaIndex(server, payload.docs[0]._index);
      }else{
        reply(payload);
      }
    });
  };
};
