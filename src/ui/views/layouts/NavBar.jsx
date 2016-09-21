var React = require('react/addons');
var ClassNames = require('classnames');


var Component = React.createClass({
    tabClass: function (tab) {

        return ClassNames({
            active: this.props.activeTab === tab
        });
    },
    render: function () {

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
                    </div>
                    <div className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={this.tabClass('home')}>
                                <a href="/">日志</a>
                            </li>
                            <li className={this.tabClass('about')}>
                                <a href="/about">关于</a>
                            </li>
                            <li className={this.tabClass('signup')}>
                                <a href="/signup">注册</a>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className={this.tabClass('login')}>
                                <a href="/login">登陆</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Component;
