var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../../components/form/ControlGroup');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  render: function () {

    var notice;
    if (!this.props.data.hydrated) {
      notice = <div className="alert alert-info">
        Loading data...
      </div>;
    }

    var formElements;
    if (this.props.data.hydrated) {
      var role = this.props.data.role || {};
      var roleUi = [];

      if (role.account) {
        roleUi.push(
          <ControlGroup key="account" label="Account" hideHelp={true}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                disabled={true}
                value={role.account.name}
              />
              <span className="input-group-btn">
                                <Link
                                  to="adminRoleDetails"
                                  params={{id: role.account.id}}
                                  className="btn btn-default">

                                    View
                                </Link>
                            </span>
            </div>
          </ControlGroup>
        );
      }

      if (role.admin) {
        roleUi.push(
          <ControlGroup key="admin" label="Admin" hideHelp={true}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                disabled={true}
                value={role.admin.name}
              />
              <span className="input-group-btn">
                                <Link
                                  to="adminDetails"
                                  params={{id: role.admin.id}}
                                  className="btn btn-default">

                                    View
                                </Link>
                            </span>
            </div>
          </ControlGroup>
        );
      }

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
        <legend>Admin Role</legend>
        {roleUi}
      </fieldset>;
    }

    return (
      <form>
        {notice}
        {formElements}
      </form>
    );
  }
});


module.exports = Component;
