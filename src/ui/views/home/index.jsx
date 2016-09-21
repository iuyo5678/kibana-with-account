var React = require('react/addons');
var Layout = require('../layouts/Default.jsx');


var Component = React.createClass({
  render: function () {

    var neck = <link rel='stylesheet' href="/bundles/public/pages/home.min.css"/>;

    return (
      <Layout
        title="平安-kibana"
        neck={neck}
        activeTab="home">

        <div className="jumbotron">
          <h1>平安-kibana</h1>
          <p className="lead">
            <div>
              <a className="btn btn-primary btn-lg" href="/signup">
                创建一个账号
              </a>
              &nbsp; or &nbsp;
              <a className="btn btn-warning btn-lg" href="/login/forgot">
                重置你的密码
              </a>
            </div>
          </p>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>登陆</h3>
                <p>
                  登陆您的kibana账户
                </p>
                <a href="/login" className="btn btn-default btn-block">
                  点击登陆
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>注册</h3>
                <p>
                  注册一个账户使用日志平台
                </p>
                <a href="/signup" className="btn btn-default btn-block">
                  点击注册
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>关于我们</h3>
                <p>
                  金科大数据团队
                </p>
                <a href="/about" className="btn btn-default btn-block">
                  查看更多
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
});


module.exports = Component;
