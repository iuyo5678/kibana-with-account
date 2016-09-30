var React = require('react/addons');
var ReactRouter = require('react-router');


var LinkedState = React.addons.LinkedStateMixin;
var Link = ReactRouter.Link;


var Component = React.createClass({
    mixins: [LinkedState],
    getDefaultProps: function () {
        return {
            data: []
        };
    },
    render: function () {

        var rows = this.props.data.map(function (record) {
          var closedFlag = "";
          var opType = ""
          if (record.isClosed) {
            closedFlag = "已处理";
          } else  {
            closedFlag = "未处理";
          }
          if (record.opType == "changeGroup") {
            opType = "更换用户组";
          }
            return (
                <tr key={record._id}>
                    <td>
                        <Link
                            className="btn btn-default btn-sm"
                            to="userRequestDetails"
                            params={{ id: record._id }}>

                            Edit
                        </Link>
                    </td>
                    <td>{opType}</td>
                    <td>{record.user.name}</td>
                    <td>{closedFlag}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive">
                <table className="table table-striped table-results">
                    <thead>
                        <tr>
                            <th></th>
                            <th>请求类型</th>
                            <th>用户名称</th>
                            <th>是否处理</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});


module.exports = Component;
