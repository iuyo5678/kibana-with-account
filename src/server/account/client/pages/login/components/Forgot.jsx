var React = require('react/addons');
var ReactRouter = require('react-router');
var ControlGroup = require('../../../components/form/ControlGroup');
var TextControl = require('../../../components/form/TextControl');
var Button = require('../../../components/form/Button');
var Spinner = require('../../../components/form/Spinner');
var Actions = require('../Actions');
var ForgotStore = require('../stores/Forgot');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
  mixins: [LinkedState],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    ForgotStore.reset();
    return ForgotStore.getState();
  },
  componentDidMount: function () {

    ForgotStore.addChangeListener(this.onStoreChange);
    this.refs.email.refs.inputField.getDOMNode().focus();
  },
  componentWillUnmount: function () {

    ForgotStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState(ForgotStore.getState());
  },
  handleSubmit: function (event) {

    event.preventDefault();
    event.stopPropagation();

    Actions.forgot({
      email: this.state.email
    });
  },
  render: function () {

    var alerts = [];
    if (this.state.success) {
      alerts.push(<div key="success">
        <div className="alert alert-success">
          如果某个账号符合该邮件地址，您将收到一封包含下一步操作的邮件。
        </div>
        <Link to="home" className="btn btn-link">返回登陆</Link>
      </div>);
    }
    else if (this.state.error) {
      alerts.push(<div key="danger" className="alert alert-danger">
        {this.state.error}
      </div>);
    }

    var formElements;
    if (!this.state.success) {
      formElements = <fieldset>
        <TextControl
          name="email"
          label="您的邮件地址是?"
          ref="email"
          hasError={this.state.hasError.email}
          valueLink={this.linkState('email')}
          help={this.state.help.email}
          disabled={this.state.loading}
        />
        <ControlGroup hideLabel={true} hideHelp={true}>
          <Button
            type="submit"
            inputClasses={{'btn-primary': true}}
            disabled={this.state.loading}>

            发送重设邮件
            <Spinner space="left" show={this.state.loading}/>
          </Button>
          <Link to="home" className="btn btn-link">返回登陆</Link>
        </ControlGroup>
      </fieldset>;
    }

    return (
      <section>
        <h1 className="page-header">忘记密码?</h1>
        <form onSubmit={this.handleSubmit}>
          {alerts}
          {formElements}
        </form>
      </section>
    );
  }
});


module.exports = Component;
