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
          if (request.auth.credentials.user.roles.admin) {
            return reply.redirect('/admin');
          }

          reply.view('account/index.jsx');
        }
    });


    next();
};


exports.register.attributes = {
    name: 'web/account'
};
