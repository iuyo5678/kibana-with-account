var React = require('react/addons');
var ReactRouter = require('react-router');
var DetailsForm = require('./DetailsForm');
var PermissionsForm = require('./PermissionsForm');
var DeleteForm = require('./DeleteForm');
var AdminRoleStore = require('../../stores/AdminRole');
var Actions = require('../../actions/AdminRole');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    AdminRoleStore.resetDetails();
    AdminRoleStore.resetPermissions();
    AdminRoleStore.resetDelete();

    Actions.getDetails(this.context.router.getCurrentParams());

    return {
      details: AdminRoleStore.getDetails(),
      permissions: AdminRoleStore.getPermissions(),
      delete: AdminRoleStore.getDelete()
    };
  },
  componentDidMount: function () {

    AdminRoleStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    AdminRoleStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState({
      details: AdminRoleStore.getDetails(),
      permissions: AdminRoleStore.getPermissions(),
      delete: AdminRoleStore.getDelete()
    });
  },
  render: function () {

    if (this.state.details.hydrated && this.state.details.fetchFailure) {
      return (
        <section className="section-admin-group-details container">
          <h1 className="page-header">
            <Link to="adminRole">Admin Role</Link> / Error
          </h1>
          <div className="alert alert-danger">
            {this.state.details.error}
          </div>
        </section>
      );
    }

    return (
      <section className="section-admin-group-details container">
        <h1 className="page-header">
          <Link to="adminRole">Admin Role</Link> / {this.state.details.name}
        </h1>
        <div className="row">
          <div className="col-sm-6">
            <DetailsForm data={this.state.details}/>
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
