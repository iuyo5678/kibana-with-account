/* global window */
var React = require('react/addons');
var Paging = require('../../../../components/Paging');
var Actions = require('../../actions/UserGroup');
var UserGroupStore = require('../../stores/UserGroup');
var FilterForm = require('./FilterForm');
var CreateNewForm = require('./CreateNewForm');
var Results = require('./Results');


var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function () {

    UserGroupStore.resetResults();
    UserGroupStore.resetCreateNew();

    Actions.getResults(this.context.router.getCurrentQuery());

    return {
      results: UserGroupStore.getResults(),
      createNew: UserGroupStore.getCreateNew()
    };
  },
  componentWillReceiveProps: function (nextProps) {

    Actions.getResults(this.context.router.getCurrentQuery());
  },
  componentDidMount: function () {

    UserGroupStore.addChangeListener(this.onStoreChange);
  },
  componentWillUnmount: function () {

    UserGroupStore.removeChangeListener(this.onStoreChange);
  },
  onStoreChange: function () {

    this.setState({
      results: UserGroupStore.getResults(),
      createNew: UserGroupStore.getCreateNew()
    });
  },
  onFiltersChange: function (event) {

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.context.router.transitionTo('userGroups', {}, this.refs.filters.state);
    window.scrollTo(0, 0);
  },
  onPageChange: function (page) {

    this.refs.filters.changePage(page);
  },
  onNewClick: function () {

    Actions.showCreateNew();
  },
  render: function () {

    return (
      <section className="section-admin-groups container">
        <div className="page-header">
          <button
            ref="createNew"
            className="btn btn-default pull-right"
            onClick={this.onNewClick}>

            Create new
          </button>
          <h1>User Groups</h1>
        </div>
        <FilterForm
          ref="filters"
          query={this.context.router.getCurrentQuery()}
          loading={this.state.results.loading}
          onChange={this.onFiltersChange}
        />
        <Results data={this.state.results.data}/>
        <Paging
          ref="paging"
          pages={this.state.results.pages}
          items={this.state.results.items}
          loading={this.state.results.loading}
          onChange={this.onPageChange}
        />
        <CreateNewForm data={this.state.createNew}/>
      </section>
    );
  }
});


module.exports = Component;
