var React = require('react/addons');


var Component = React.createClass({
    render: function () {

        return (
            <div className="footer">
                <div className="container">
                    <span className="copyright pull-right">
                        &#169;.
                    </span>
                    <ul className="links">
                        <li><a href="/">看日志</a></li>
                        <li><a href="/login/logout">退出登陆</a></li>
                    </ul>
                </div>
            </div>
        );
    }
});


module.exports = Component;
