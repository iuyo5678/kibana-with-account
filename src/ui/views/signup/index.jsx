var React = require('react/addons');
var Layout = require('../layouts/Default.jsx');


var Component = React.createClass({
    render: function () {

        var feet = <script src="/bundles/public/pages/signup.min.js"></script>;

        return (
            <Layout
                title="Sign up"
                feet={feet}
                activeTab="signup">

                <div className="row">
                    <div className="col-sm-6" id="app-mount"></div>
                </div>
            </Layout>
        );
    }
});


module.exports = Component;
