describe('_.organize', function () {
  var _ = require('lodash');
  var expect = require('expect.js');

  it('it works', function () {
    var col = [
      {
        name: 'one',
        role: ['user', 'admin', 'owner']
      },
      {
        name: 'two',
        role: ['user']
      },
      {
        name: 'three',
        role: ['user']
      },
      {
        name: 'four',
        role: ['user', 'admin']
      }
    ];

    var resp = _.organizeBy(col, 'role');
    expect(resp).to.have.property('user');
    expect(resp.user).to.have.length(4);

    expect(resp).to.have.property('admin');
    expect(resp.admin).to.have.length(2);

    expect(resp).to.have.property('owner');
    expect(resp.owner).to.have.length(1);
  });

  it('behaves just like groupBy in normal scenarios', function () {
    var col = [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' },
      { name: 'four' }
    ];

    var orgs = _.organizeBy(col, 'name');
    var groups = _.groupBy(col, 'name');
    expect(orgs).to.eql(groups);
  });
});
