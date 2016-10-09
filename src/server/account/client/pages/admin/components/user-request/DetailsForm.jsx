var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var TextControl = require('../../../../components/form/TextControl');
var Button = require('../../../../components/form/Button');
var Spinner = require('../../../../components/form/Spinner');
var Actions = require('../../actions/UserRequest');


var Component = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {

    return {};
  },
  componentWillReceiveProps: function (nextProps) {

    if (!this.state.hydrated) {
      var result = {
        hydrated: nextProps.data.hydrated,
        username: nextProps.data.username,
        opType: nextProps.data.opType,
        newGroup: nextProps.data.opParameter.newGroup,
        oldGroup: nextProps.data.opParameter.oldGroup,
        timeCreated: nextProps.data.timeCreated,
        isClosed: nextProps.data.isClosed
      };
      if (nextProps.data.isClosed) {
        result.timeExecutor = nextProps.data.timeExecutor
      }
      this.setState(result);
    }
  },
  handleSubmit: function (event) {

    event.preventDefault();
    event.stopPropagation();
    if (this.state.opType == "changeGroup") {
      Actions.saveDetails({
        id: this.props.data._id,
        opType: this.state.opType,
        username: this.state.username,
        oldGroup: this.state.oldGroup,
        newGroup: this.state.newGroup
      });
    }
  },
  render: function () {

    var alerts = [];
    if (this.props.data.success) {
      alerts.push(<div key="success" className="alert alert-success">
        Success. Changes have been saved.
      </div>);
    }
    else if (this.props.data.error) {
      alerts.push(<div key="danger" className="alert alert-danger">
        {this.props.data.error}
      </div>);
    }

    var notice;
    if (!this.props.data.hydrated) {
      notice = <div className="alert alert-info">
        Loading data...
      </div>;
    }
    var requestDetail;
    var requestSubmit;
    var formElements;
    if (this.props.data.hydrated) {

      if (this.props.data.opType == "changeGroup") {
        requestDetail = <div>
          <TextControl
            name="opType"
            label="Request Type"
            hasError={this.props.data.hasError.opType}
            value="变更用户组"
            help={this.props.data.help.opType}
            disabled={true}
          />
          <TextControl
            name="oldGroup"
            label="Old Group"
            hasError={this.props.data.hasError.oldGroup}
            valueLink={this.linkState('oldGroup')}
            help={this.props.data.help.oldGroup}
            disabled={true}
          />
          <TextControl
            name="newGroup"
            label="New Group"
            hasError={this.props.data.hasError.newGroup}
            valueLink={this.linkState('newGroup')}
            help={this.props.data.help.newGroup}
            disabled={true}
          />
        </div>;
      }
      if (this.props.data.isClosed) {
        requestSubmit = <ControlGroup hideLabel={true} hideHelp={true}>
          <TextControl
            name="timeExecutor"
            label="Time Executor"
            hasError={this.props.data.hasError.timeExecutor}
            valueLink={this.linkState('timeExecutor')}
            help={this.props.data.help.timeExecutor}
            disabled={true}
          />
        </ControlGroup>
      } else {
        requestSubmit = <ControlGroup hideLabel={true} hideHelp={true}>
          <Button
            type="submit"
            inputClasses={{'btn-primary': true}}
            disabled={this.props.data.loading}>
            Save changes
            <Spinner space="left" show={this.props.data.loading}/>
          </Button>
        </ControlGroup>
      }
      formElements = <fieldset>
        <legend>Details</legend>
        {alerts}
        <TextControl
          name="username"
          label="UserName"
          hasError={this.props.data.hasError.username}
          valueLink={this.linkState('username')}
          help={this.props.data.help.username}
          disabled={true}
        />
        <TextControl
          name="requestTime"
          label="Request Time"
          hasError={this.props.data.hasError.timeCreated}
          valueLink={this.linkState('timeCreated')}
          help={this.props.data.help.timeCreated}
          disabled={true}
        />
        {requestDetail}
        {requestSubmit}
      </fieldset>;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        {notice}
        {formElements}
      </form>
    );
  }
});


module.exports = Component;
