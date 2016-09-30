var React = require('react/addons');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Spinner = require('../../../../components/form/Spinner');
var Button = require('../../../../components/form/Button');
var Actions = require('../../Actions');


var Component = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {

    return {};
  },
  componentWillReceiveProps: function (nextProps) {
    if (!this.state.hydrated) {
      this.setState({
        hydrated: nextProps.data.hydrated,
        userGroup: nextProps.data.userGroup,
      });
    }
  },

  handleSubmit: function (event) {
    event.preventDefault();
    event.stopPropagation();

    var newGroup = this.state.newGroup;

    if (!newGroup) {
      this.setState({
        error: '请选择一个有效的用户组!'
      });
      setTimeout(function () {
        this.setState({
          error: undefined
        });
      }.bind(this), 1000);
      return;
    }

    var newGroupValue;
    this.state.userGroup.forEach(function (group) {

      if (group.name === newGroup) {
        newGroupValue = group.name;
      }
    });

    var currentGroup = this.props.user.group || '';
    if (currentGroup == newGroupValue) {
      this.setState({
        error: '当前所属用户组和目的用户组相同'
      });
      setTimeout(function () {
        this.setState({
          error: undefined
        });
      }.bind(this), 1000);
      return;
    }

    Actions.saveUserGroupSettings({
      opType: "changeGroup",
      opParameter:{
        oldGroup: currentGroup,
        newGroup: newGroupValue
      },
      userEmail: this.props.user.email

    });
  },
  render: function () {
    var alerts = [];
    var error = this.state.error || this.props.data.error;
    if (this.props.data.success) {
      alerts.push(<div key="success" className="alert alert-success">
        您的请求已经成功提交.
      </div>);
    }
    else if (error) {
      alerts.push(<div key="danger" className="alert alert-danger">
        {error}
      </div>);
    }

    var notice;
    if (!this.props.data.hydrated || !this.props.user.hydrated) {
      notice = <div className="alert alert-info">
        Loading group data...
      </div>;
    }

    if (this.props.data.hydrated && this.props.user.hydrated) {
      var userGroups = this.props.data.userGroup;
      var groupOptions = userGroups.map(function (group) {

        return (
          <option key={group.name} value={group.name}>
            {group.name}
          </option>
        );
      });

      var formElements;
      formElements = <fieldset>
        <legend>更换用户组</legend>
        {alerts}
        <ControlGroup label="选择用户组" hideHelp={true}>
          <div className="input-group">
            <select
              ref="newGroup"
              name="newGroup"
              className="form-control"
              valueLink={this.linkState('newGroup')}>

              <option value="">--- 选择 ---</option>
              {groupOptions}
            </select>
          </div>
        </ControlGroup>
        <ControlGroup hideLabel={true} hideHelp={true}>
          <Button
            type="submit"
            inputClasses={{ 'btn-primary': true }}
            disabled={this.props.data.loading}>

            更新用户组
            <Spinner
              space="left"
              show={this.props.data.loading}
            />
          </Button>
        </ControlGroup>
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
