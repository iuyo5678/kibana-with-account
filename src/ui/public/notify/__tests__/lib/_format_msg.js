describe('formatMsg', function () {
  var formatMsg = require('ui/notify/lib/_format_msg');
  var expect = require('expect.js');

  it('should prepend the second argument to result', function () {
    var actual = formatMsg('error message', 'unit_test');

    expect(actual).to.equal('unit_test: error message');
  });

  it('should handle a simple string', function () {
    var actual = formatMsg('error message');

    expect(actual).to.equal('error message');
  });

  it('should handle a simple Error object', function () {
    var err = new Error('error message');
    var actual = formatMsg(err);

    expect(actual).to.equal('error message');
  });

  it('should handle a simple Angular $http error object', function () {
    var err = {
      data: {
        statusCode: 403,
        error: 'Forbidden',
        message: '[security_exception] action [indices:data/read/mget] is unauthorized for user [user]'
      },
      status: 403,
      config: {},
      statusText: 'Forbidden'
    };
    var actual = formatMsg(err);

    expect(actual).to.equal('Error 403 Forbidden: [security_exception] action [indices:data/read/mget] is unauthorized for user [user]');
  });

  it('should handle an extended elasticsearch error', function () {
    var err = {
      resp : {
        error : {
          root_cause : [
            {
              reason : 'I am the detailed message'
            }
          ]
        }
      }
    };

    var actual = formatMsg(err);

    expect(actual).to.equal('I am the detailed message');
  });

});
