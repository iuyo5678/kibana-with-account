var React = require('react/addons');
var ReactRouter = require('react-router');
var ClassNames = require('classnames');


var Link = ReactRouter.Link;


var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    return {
      navBarOpen: false
    };
  },
  componentWillReceiveProps: function () {

    this.setState({navBarOpen: false});
  },
  isNavActive: function (routes) {

    return ClassNames({
      active: routes.some(function (route) {
        return this.context.router.isActive(route);
      }.bind(this))
    });
  },
  tabClass: function (tab) {

    return ClassNames({
      active: this.props.activeTab === tab
    });
  },
  toggleMenu: function () {

    this.setState({navBarOpen: !this.state.navBarOpen});
  },
  render: function () {

    var navBarCollapse = ClassNames({
      'navbar-collapse': true,
      collapse: !this.state.navBarOpen
    });

    return (
      <div className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <img
                className="navbar-logo"
                src="/bundles/public/media/logo-pingan.png"
              />
              <span className="navbar-brand-label">pingan-kibana</span>
            </a>
            <button
              className="navbar-toggle collapsed"
              onClick={this.toggleMenu}>

              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className={navBarCollapse}>
            <ul className="nav navbar-nav">
              <li className={this.tabClass('home')}>
                <a href="/">日志</a>
              </li>
              <li className={this.isNavActive(['home'])}>
                <Link to="home">我的账号</Link>
              </li>
              <li className={this.isNavActive(['settings'])}>
                <Link to="settings">设置</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a href="/login/logout">退出登陆</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = Component;
