import React, { Component } from 'react';
import Homepage from './Components/Homepage';
import Login from './Components/Login';
import './Redux/stores'
import { connect } from 'react-redux';
import { loggedIn, addUser, loggedOut, removeUser } from './Redux/actions'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.checkExpireTime = this.checkExpireTime.bind(this);
    this.setInitialTimeout();
  }

  checkAuthentication() {
    if (!this.props.isLoggedIn || this.props.user === {}) {
      fetch("http://localhost:9000/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        }
      })
        .then(response => {
          console.log('fetched login success');
          if (response.status === 200) return response.json();
          throw new Error("failed to authenticate user");
        })
        .then(responseJson => {
          console.log(responseJson.message);
          console.log(responseJson.user);
          this.props.addUser(responseJson.user);
          this.props.loggedIn();

        })
    }
  }

  setInitialTimeout() {
    // Check expire time immediately
    this.logoutTimeout = setTimeout(this.checkExpireTime, 1 * 1000);
  }
  setRegularTimeout() {
    // Check expire time at regular intervals
    // Every 5 minutes
    this.logoutTimeout = setTimeout(this.checkExpireTime, 5 * 60 * 1000);
  }

  checkExpireTime() {
    if (this.props.isLoggedIn) {
      console.log("Checking....")
      if (Date.now() > this.props.user.expireTime) {
        console.log("logout");
        this.logout();
      } else {
        this.setRegularTimeout();
      }
    }
  }

  logout() {
    alert("Session Expired, you have been logged out")
    spotifyApi.setAccessToken(this.props.user.accessToken);
    spotifyApi.pause();
    fetch("http://localhost:9000/logout");
    this.props.loggedOut();
    this.props.removeUser();
  }

  componentWillMount() {
    this.checkAuthentication();
  }

  render() {
    return (
      <div className="App" style={{ height: '100%' }}>
        {this.props.isLoggedIn
          ? <Homepage />
          : <Login />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { isLoggedIn: state.authentication, user: state.userProfile }
}

export default connect(mapStateToProps, { loggedIn, addUser, loggedOut, removeUser })(App);
