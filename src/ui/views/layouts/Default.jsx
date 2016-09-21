var React = require('react/addons');
var NavBar = require('./NavBar.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/bundles/public/core.min.css" />
                    <link rel="stylesheet" href="/bundles/public/layouts/default.min.css" />
                    <link rel="shortcut icon" href="/bundles/public/media/favicon.ico" />
                    {this.props.neck}
                </head>
                <body>
                    <NavBar activeTab={this.props.activeTab} />
                    <div className="page">
                        <div className="container">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="footer">
                        <div className="container">
                            <span className="copyright pull-right">
                                &copy;
                            </span>
                            <ul className="links">
                                <li><a href="/xiangyun-log">看日志</a></li>
                            </ul>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                    <script src="/bundles/public/core.min.js"></script>
                    {this.props.feet}
                </body>
            </html>
        );
    }
});


module.exports = Component;
