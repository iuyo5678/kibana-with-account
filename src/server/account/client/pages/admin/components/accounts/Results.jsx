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

      return (
        <tr key={record._id}>
          <td>
            <Link
              className="btn btn-default btn-sm"
              to="accountDetails"
              params={{id: record._id}}>

              Edit
            </Link>
          </td>
          <td>{record.name.first} {record.name.last}</td>
          <td>{record._id}</td>
        </tr>
      );
    });

    return (
      <div className="table-responsive">
        <table className="table table-striped table-results">
          <thead>
          <tr>
            <th></th>
            <th className="stretch">name</th>
            <th>id</th>
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
