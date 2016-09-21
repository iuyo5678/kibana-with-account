var React = require('react/addons');
var Layout = require('../layouts/Plain.jsx');


var Component = React.createClass({
    render: function () {

        var neck = [
            <link key="layout" rel="stylesheet" href="/bundles/public/layouts/default.min.css" />,
            <link key="page" rel="stylesheet" href="/bundles/public/pages/admin.min.css" />
        ];
        var feet = <script src="/bundles/public/pages/admin.min.js"></script>;

        return (
            <Layout
                title="Admin"
                neck={neck}
                feet={feet}>

                <div id="app-mount"></div>
            </Layout>
        );
    }
});


module.exports = Component;
