import React, { Component } from 'react'
import srv from './component/api/apiServ'
import {Switch, Route} from 'react-router-dom';
import Dashboard from './component/home/Dashboard'
import Welcome from './component/home/Welcome'
import Signup from './component/auth/Signup'
import Login from './component/auth/Login'
import CRUDServices from './component/CrudServices/CRUDServices'
import NewBug from './component/bugs/NewBug'
import BugsList from './component/bugs/BugsList'
import BugDetails from './component/bugs/BugDetails'
import UserProfil from './component/auth/User-profil'


export default class App extends Component {
  state = {
    user: {},
    listOfServices:[]
  }

  fetchUser = () => {
    if (!this.state.user._id) {
      srv.loggedin()
        .then(data => this.setState({user: data}))
        .catch(err => this.setState({user: {}}))
      ;
    } else {
      console.log('user already in the state')
    }
  };
  
  getAllServices = () =>{
    srv.serviceList()
    .then(response => {
      console.log("services list", response)
      this.setState({
        listOfServices: response
      })
    })
  }

  updateUser = (data) => {
    this.setState({user: data});
  };

  componentDidMount() {
    this.fetchUser();
    this.getAllServices();
  }

  render() {
    return (
      <Route render={props => (
        <div className="App"  style= {{background: "#3f51b50d" }}> {/* data-route="/" allow us to style pages */}

          <Switch>
            <Route exact path="/" render={(props) => (
              <Welcome user={this.state.user} />
            )} />

            <Route exact path="/dashboard" render={(props) => (
              <Dashboard user={this.state.user} updateUser={this.updateUser} history={props.history} />
            )} />

            <Route exact path="/signup" render={(props) => (
              <Signup listOfServices={this.state.listOfServices}  updateUser={this.updateUser} history={props.history} />
            )} />

            <Route exact path="/login" render={(props) => (
              <Login updateUser={this.updateUser} history={props.history} />
            )} />

            <Route exact path="/services" render={(props) => (
              <CRUDServices user={this.state.user} updateUser={this.updateUser} history={props.history} />
            )} />

            <Route exact path="/new-bug" render={(props) => (
              <NewBug user={this.state.user} updateUser={this.updateUser}  history={props.history} />
            )} />

            <Route exact path="/bug-details/:id" render={(props) => (
              <BugDetails user={this.state.user} updateUser={this.updateUser}  history={props.history} {...props} />
            )} />

            <Route exact path="/bugs-list" render={(props) => (
              <BugsList user={this.state.user} updateUser={this.updateUser}  history={props.history}  />
            )} />

            <Route exact path="/profil" render={(props) => (
              <UserProfil user={this.state.user}  history={props.history}  updateUser={this.updateUser}/>
            )} />

            {/* last route, ie: 404 */}
            <Route render={() => (<h1>Not Found</h1>)} />
          </Switch>
        </div>
      )} />
    )
  }
}
