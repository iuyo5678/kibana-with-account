var React = require('react/addons');
var Actions = require('../../Actions');
var PasswordStore = require('../../stores/Password');
var UserStore = require('../../stores/User');
var UserGroupStore = require('../../stores/UserGroup');
var UserForm = require('./UserForm');
var UserGroupForm = require('./UserGroupForm');
var PasswordForm = require('./PasswordForm');


var Component = React.createClass({
  getInitialState: function () {

    PasswordStore.reset();
    UserStore.reset();
    UserGroupStore.reset();


    Actions.getUserSettings();
    Actions.getAllUserGroupSettings();

    return this.getStateFromStores();
  },
  getStateFromStores: function () {

    return {
      user: UserStore.getState(),
      password: PasswordStore.getState(),
      userGroup: UserGroupStore.getState()
    };
  },
  componentDidMount: function () {

    UserStore.addChangeListener(this.onStoreChange);
    PasswordStore.addChangeListener(this.onStoreChange);
    UserGroupStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    UserStore.removeChangeListener(this.onStoreChange);
    PasswordStore.removeChangeListener(this.onStoreChange);
    UserGroupStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState(this.getStateFromStores());
  },
  render: function () {

    return (
      <section className="section-settings container">
        <h1 className="page-header">账号设置</h1>
        <div className="row">
          <div className="col-sm-6">
            <UserForm data={this.state.user}/>
            <UserGroupForm
              data={this.state.userGroup}
              user={this.state.user}
            />
            <PasswordForm data={this.state.password}/>
          </div>
        </div>
      </section>
    );
  }
});


module.exports = Component;
