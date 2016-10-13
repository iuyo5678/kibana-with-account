var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../../components/form/ControlGroup');
var Spinner = require('../../../../components/form/Spinner');
var Button = require('../../../../components/form/Button');
var Actions = require('../../actions/User');

var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {};
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
    this.props.userGroup.data.forEach(function (group) {

      if (group.name === newGroup) {
        newGroupValue = group.name;
      }
    });

    var currentGroup = this.props.data.group || '';
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
      id: this.props.data._id,
      opType: "changeGroup",
      username: this.props.data.username,
      oldGroup: currentGroup,
      newGroup: newGroupValue
    });
  },
  render: function () {
    var alerts = [];
    var error = this.state.error || this.props.data.error || this.props.userGroup.error;
    if (this.props.userGroup.response) {
      alerts.push(<div key="success" className="alert alert-success">
        您的请求已经成功提交, 页面即将刷新....
      </div>);
    }
    else if (error) {
      alerts.push(<div key="danger" className="alert alert-danger">
        {error}
      </div>);
    }

    var notice;
    if (!this.props.data.hydrated || !this.props.userGroup.hydrated) {
      notice = <div className="alert alert-info">
        Loading data...
      </div>;
    }

    var formElements;
    if (this.props.data.hydrated && this.props.userGroup.hydrated) {

      var userGroups = this.props.userGroup.data;
      var groupOptions = userGroups.map(function (group) {

        return (
          <option key={group.name} value={group.name}>
            {group.name}
          </option>
        );
      });

      var groupElements;
      groupElements = <div>
        <ControlGroup label="select user group" hideHelp={true}>
          <div className="input-group">
            <select
              ref="newGroup"
              name="newGroup"
              className="form-control"
              valueLink={this.linkState('newGroup')}>

              <option value="">--- Select ---</option>
              {groupOptions}
            </select>
          </div>
        </ControlGroup>
        <ControlGroup hideLabel={true} hideHelp={true}>
          <Button
            type="submit"
            inputClasses={{'btn-primary': true}}
            disabled={this.props.data.loading}>

            更新用户组
            <Spinner
              space="left"
              show={this.props.data.loading}
            />
          </Button>
        </ControlGroup>
      </div>;

      var role = this.props.data.role || {};
      var roleUi = [];
      roleUi.push(
        <ControlGroup key="account" label="Admin Roles" hideHelp={true}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={role.name}
            />
              <span className="input-group-btn">
                                <Link
                                  to="adminRoleDetails"
                                  params={{id: role.id}}
                                  className="btn btn-default">
                                  View
                                </Link>
                            </span>
          </div>
        </ControlGroup>
      );



      if (roleUi.length === 0) {
        roleUi.push(
          <ControlGroup key="empty" hideLabel={true} hideHelp={true}>
                        <span className="label label-default">
                            no role defined
                        </span>
          </ControlGroup>
        );
      }

      formElements = <fieldset>
        <legend>User Role</legend>
        {alerts}
        {roleUi}
        {groupElements}
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
