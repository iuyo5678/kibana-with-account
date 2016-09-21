var React = require('react/addons');
var Layout = require('../layouts/Default.jsx');


var Component = React.createClass({
    render: function () {

        return (
            <Layout
                title="About us"
                activeTab="about">

                <div className="row">
                    <div className="col-sm-12">
                        <h1 className="page-header">关于我们</h1>
                        <div className="media">
                            <div className="pull-left">
                                <div className="media-object">
                                    <i className="fa fa-camera-retro fa-4x"></i>
                                </div>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading">pingan-kibana</h4>
                                <p>
                                    pingan-kibana 基于kibana开发，添加了账户管理功能，后续会继续改进
                                </p>
                            </div>
                        </div>
                        <div className="media text-right">
                            <div className="pull-right">
                                <div className="media-object">
                                    <i className="fa fa-camera-retro fa-4x"></i>
                                </div>
                            </div>
                            <div className="media-body">
                              <h4 className="media-heading">平安金科大数据</h4>
                              <p>
                                我们是专业的大数据处理团队
                                <a href="mailto: @pingan.com.cn?Subject=pingan-kibana" target="_top">邮件咨询</a>
                              </p>
                            </div>
                        </div>
                        <div className="media">
                            <div className="pull-left">
                                <div className="media-object">
                                    <i className="fa fa-camera-retro fa-4x"></i>
                                </div>
                            </div>
                            <div className="media-body">
                              <h4 className="media-heading">作者：</h4>
                              <p>
                                张鼓华 <a href="mailto:zhangguhua465@pingan.com.cn?Subject=pingan-kibana" target="_top">邮件咨询</a>
                              </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
});


module.exports = Component;
