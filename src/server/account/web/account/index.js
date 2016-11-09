exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/account/{glob*}',
    config: {
      auth: {
        strategy: 'session'
      }
    },
    handler: function (request, reply) {
      if (request.auth.credentials.role.name === 'root') {
        return reply.redirect('/kibana-admin');
      }

      reply.view('account/index.jsx');
    }
  });


  next();
};


exports.register.attributes = {
  name: 'web/account'
};
