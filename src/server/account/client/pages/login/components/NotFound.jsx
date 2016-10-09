var React = require('react/addons');
var ReactRouter = require('react-router');


var Link = ReactRouter.Link;


var Component = React.createClass({
  render: function () {

    return (
      <section className="section-not-found container">
        <h1 className="page-header">没有找到该页面</h1>
        <p>请确认您输入的网址是否正确,很抱歉没有找到您请求的页面.</p>
        <Link to="home">返回登陆</Link>
      </section>
    );
  }
});


module.exports = Component;
