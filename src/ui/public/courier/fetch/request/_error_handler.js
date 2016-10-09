define(function (require) {
  return function RequestErrorHandlerFactory(Private, Notifier) {
    var errHandlers = Private(require('ui/courier/_error_handlers'));

    var notify = new Notifier({
      location: 'Courier fetch Error'
    });

    function handleError(req, error) {
      var myHandlers = [];

      errHandlers.splice(0).forEach(function (handler) {
        (handler.source === req.source ? myHandlers : errHandlers).push(handler);
      });

      if (!myHandlers.length) {
        notify.fatal(new Error(`unhandled courier request error: ${ notify.describeError(error) }`));
      } else {
        myHandlers.forEach(function (handler) {
          handler.defer.resolve(error);
        });
      }
    }

    return handleError;
  };
});
