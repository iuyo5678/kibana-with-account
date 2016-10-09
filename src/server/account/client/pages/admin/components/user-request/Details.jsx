var React = require('react/addons');
var ReactRouter = require('react-router');
var DetailsForm = require('./DetailsForm');
var UserRequestStore = require('../../stores/UserRequest');
var Actions = require('../../actions/UserRequest');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    UserRequestStore.resetDetails();

    Actions.getDetails(this.context.router.getCurrentParams());

    return {
      details: UserRequestStore.getDetails(),
    };
  },
  componentDidMount: function () {

    UserRequestStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    UserRequestStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState({
      details: UserRequestStore.getDetails()
    });
  },
  render: function () {

    if (this.state.details.hydrated && this.state.details.fetchFailure) {
      return (
        <section className="section-status-details container">
          <h1 className="page-header">
            <Link to="userRequest">UserRequest</Link> / Error
          </h1>
          <div className="alert alert-danger">
            {this.state.details.error}
          </div>
        </section>
      );
    }

    return (
      <section className="section-status-details container">
        <h1 className="page-header">
          <Link to="userRequest">UserRequest</Link> / {this.state.details.name}
        </h1>
        <div className="row">
          <div className="col-sm-6">
            <DetailsForm data={this.state.details}/>
          </div>
        </div>
      </section>
    );
  }
});


module.exports = Component;
