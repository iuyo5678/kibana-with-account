var React = require('react/addons');
var ReactRouter = require('react-router');
var DetailsForm = require('./DetailsForm');
var DeleteForm = require('./DeleteForm');
var UserGroupStore = require('../../stores/UserGroup');
var Actions = require('../../actions/UserGroup');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    UserGroupStore.resetDetails();
    UserGroupStore.resetDelete();

    Actions.getDetails(this.context.router.getCurrentParams());

    return {
      details: UserGroupStore.getDetails(),
      delete: UserGroupStore.getDelete()
    };
  },
  componentDidMount: function () {

    UserGroupStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    UserGroupStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState({
      details: UserGroupStore.getDetails(),
      delete: UserGroupStore.getDelete()
    });
  },
  render: function () {

    if (this.state.details.hydrated && this.state.details.fetchFailure) {
      return (
        <section className="section-admin-group-details container">
          <h1 className="page-header">
            <Link to="userGroups">User Groups</Link> / Error
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
          <Link to="userGroups">User Groups</Link> / {this.state.details.name}
        </h1>
        <div className="row">
          <div className="col-sm-6">
            <DetailsForm data={this.state.details}/>
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
