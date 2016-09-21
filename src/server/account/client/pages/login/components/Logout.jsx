var React = require('react/addons');
var ReactRouter = require('react-router');
var Actions = require('../Actions');
var LogoutStore = require('../stores/Logout');


var Link = ReactRouter.Link;
var Navigation = ReactRouter.Navigation;


var Component = React.createClass({
    mixins: [Navigation],
    getInitialState: function () {

        LogoutStore.reset();
        return LogoutStore.getState();
    },
    componentDidMount: function () {

        LogoutStore.addChangeListener(this.onStoreChange);
        Actions.logout();
    },
    componentWillUnmount: function () {

        LogoutStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState(LogoutStore.getState());
    },
    render: function () {

        var alerts = [];
        if (this.state.success) {
            alerts.push(<div key="success" className="alert alert-success">
                已经退出登陆！
            </div>);
        }
        else if (this.state.error) {
            alerts.push(<div key="danger" className="alert alert-warning">
                {this.state.error}
            </div>);
        }

        return (
            <section>
                <h1 className="page-header">退出登陆</h1>
                {alerts}
                <Link to="home" className="btn btn-link">返回登陆</Link>
            </section>
        );
    }
});


module.exports = Component;
