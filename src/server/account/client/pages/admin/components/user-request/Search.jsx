/* global window */
var React = require('react/addons');
var Paging = require('../../../../components/Paging');
var Actions = require('../../actions/UserRequest');
var UserRequestStore = require('../../stores/UserRequest');
var FilterForm = require('./FilterForm');
var Results = require('./Results');


var Component = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {

        UserRequestStore.resetResults();

        Actions.getResults(this.context.router.getCurrentQuery());

        return {
            results: UserRequestStore.getResults(),
        };
    },
    componentWillReceiveProps: function (nextProps) {

        Actions.getResults(this.context.router.getCurrentQuery());
    },
    componentDidMount: function () {

        UserRequestStore.addChangeListener(this.onStoreChange);
    },
    componentWillUnmount: function () {

        UserRequestStore.removeChangeListener(this.onStoreChange);
    },
    onStoreChange: function () {

        this.setState({
            results: UserRequestStore.getResults()
        });
    },
    onFiltersChange: function (event) {

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.context.router.transitionTo('userRequest', {}, this.refs.filters.state);
        window.scrollTo(0, 0);
    },
    onPageChange: function (page) {

        this.refs.filters.changePage(page);
    },

    render: function () {

        return (
            <section className="section-statuses container">
                <div className="page-header">
                    <h1>UserRequest</h1>
                </div>
                <FilterForm
                    ref="filters"
                    query={this.context.router.getCurrentQuery()}
                    loading={this.state.results.loading}
                    onChange={this.onFiltersChange}
                />
                <Results data={this.state.results.data} />
                <Paging
                    ref="paging"
                    pages={this.state.results.pages}
                    items={this.state.results.items}
                    loading={this.state.results.loading}
                    onChange={this.onPageChange}
                />
            </section>
        );
    }
});


module.exports = Component;
