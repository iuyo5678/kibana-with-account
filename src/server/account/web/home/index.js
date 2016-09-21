exports.register = function (plugin, options, next) {

  plugin.route({
    method: 'GET',
    path: '/',
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
      if (request.auth.isAuthenticated) {
        return reply.redirect('/xiangyun-log');
      }
      return reply.view('home/index.jsx');
    }
  });


  next();
};


exports.register.attributes = {
  name: 'web/home'
};
