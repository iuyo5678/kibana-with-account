exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/login/{glob*}',
    config: {
      auth: {
        mode: 'try',
        strategy: 'session'
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      }
    },
    handler: function (request, reply) {

      if (request.params.glob !== 'logout' &&
        request.auth.isAuthenticated) {

        if (request.auth.credentials.role.name === 'root') {
          return reply.redirect('/kibana-admin');
        }

        return reply.redirect('/xiangyun-log');
      }

      var response = reply.view('login/index.jsx');
      response.header('x-auth-required', true);
    }
  });


  next();
};


exports.register.attributes = {
  name: 'web/login'
};
