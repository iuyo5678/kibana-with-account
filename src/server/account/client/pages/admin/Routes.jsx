var React = require('react/addons');
var ReactRouter = require('react-router');
var App = require('./components/App');
var Home = require('./components/home/Controller');
var NotFound = require('./components/not-found/Controller');
var AdminSearch = require('./components/admins/Search');
var AdminDetails = require('./components/admins/Details');
var AdminRoleSearch = require('./components/admin-role/Search');
var AdminRoleDetails = require('./components/admin-role/Details');
var UserRequestSearch = require('./components/user-request/Search');
var UserRequestDetails = require('./components/user-request/Details');
var UserSearch = require('./components/users/Search');
var UserDetails = require('./components/users/Details');
var UserGroupSearch = require('./components/user-groups/Search');
var UserGroupDetails = require('./components/user-groups/Details');

var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;


var routes = (
  <Route path="/kibana-admin" name="app" handler={App}>
    <DefaultRoute name="home" handler={Home}/>
    <NotFoundRoute name="notFound" handler={NotFound}/>

    <Route path="admins" name="admins" handler={AdminSearch}/>
    <Route path="admins/:id" name="adminDetails" handler={AdminDetails}/>
    <Route path="admin-role" name="adminRole" handler={AdminRoleSearch}/>
    <Route path="admin-role/:id" name="adminRoleDetails" handler={AdminRoleDetails}/>
    <Route path="user-request" name="userRequest" handler={UserRequestSearch}/>
    <Route path="user-request/:id" name="userRequestDetails" handler={UserRequestDetails}/>
    <Route path="users" name="users" handler={UserSearch}/>
    <Route path="users/:id" name="userDetails" handler={UserDetails}/>
    <Route path="user-groups" name="userGroups" handler={UserGroupSearch}/>
    <Route path="user-groups/:id" name="userGroupsDetail" handler={UserGroupDetails}/>
  </Route>
);


module.exports = routes;
