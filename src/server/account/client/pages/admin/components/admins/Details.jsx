var React = require('react/addons');
var ReactRouter = require('react-router');
var DetailsForm = require('./DetailsForm');
var UserForm = require('./UserForm');
var GroupsForm = require('./GroupsForm');
var PermissionsForm = require('./PermissionsForm');
var DeleteForm = require('./DeleteForm');
var AdminStore = require('../../stores/Admin');
var AdminRoleStore = require('../../stores/AdminRole');
var Actions = require('../../actions/Admin');
var GroupActions = require('../../actions/AdminRole');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    AdminStore.resetDetails();
    AdminStore.resetPermissions();
    AdminStore.resetUser();
    AdminStore.resetGroups();
    AdminStore.resetDelete();
    AdminRoleStore.resetResults();

    Actions.getDetails(this.context.router.getCurrentParams());
    GroupActions.getResults({fields: 'name', limit: 99});

    return {
      details: AdminStore.getDetails(),
      permissions: AdminStore.getPermissions(),
      user: AdminStore.getUser(),
      groups: AdminStore.getGroups(),
      delete: AdminStore.getDelete(),
      adminRole: AdminRoleStore.getResults()
    };
  },
  componentDidMount: function () {

    AdminStore.addChangeListener(this.onStoreChange);
    AdminRoleStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    AdminStore.removeChangeListener(this.onStoreChange);
    AdminRoleStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState({
      user: AdminStore.getUser(),
      groups: AdminStore.getGroups(),
      permissions: AdminStore.getPermissions(),
      delete: AdminStore.getDelete(),
      adminRole: AdminRoleStore.getResults()
    });
  },
  render: function () {

    if (this.state.details.hydrated && this.state.details.fetchFailure) {
      return (
        <section className="section-admin-details container">
          <h1 className="page-header">
            <Link to="admins">Admins</Link> / Error
          </h1>
          <div className="alert alert-danger">
            {this.state.details.error}
          </div>
        </section>
      );
    }

    return (
      <section className="section-admin-details container">
        <h1 className="page-header">
          <Link to="admins">Admins</Link> / {this.state.details.name.first} {this.state.details.name.last}
        </h1>
        <div className="row">
          <div className="col-sm-8">
            <UserForm
              details={this.state.details}
              data={this.state.user}
            />
            <GroupsForm
              details={this.state.details}
              data={this.state.groups}
              list={this.state.adminRole}
            />
            <PermissionsForm
              details={this.state.details}
              data={this.state.permissions}
            />
            <DeleteForm
              details={this.state.details}
              data={this.state.delete}
            />
          </div>
        </div>
      </section>
    );
  }
});


module.exports = Component;
