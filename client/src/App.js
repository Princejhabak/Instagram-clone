import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';

import Homepage from './components/Homepage';
import CreatePost from './components/post/CreatePost';
import Comments from './components/post/Comments';

import Profile from './components/profile/Profile';
import ProfileUpdate from './components/profile/ProfileUpdate';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }

}

class App extends Component{
  render(){

    return (
      <Provider store={store}>
        <Router>

            <Switch>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/register" component={Register}></Route>
              <Route  path="/" component={Navbar}/>
            </Switch>
            
            <Route exact path="/" component={Homepage}></Route>
            <Route exact path="/post/create" component={CreatePost}></Route>
            <Route exact path="/post/:postId/comment" component={Comments}></Route>
            
            <Switch>
              <Route exact path="/profile/update" component={ProfileUpdate}></Route>
              <Route exact path="/profile/:username" component={Profile}></Route>
            </Switch>
            
        </Router>
      </Provider>
    );
  }
    
}

export default App;
