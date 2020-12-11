import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from '../../actions/authActions';

import InstagramTextLogo from '../../assets/images/instagram-text-logo.jpg';
import './login.css';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    }

    this.props.loginUser(user);
    
  }

  render(){
    const {errors} = this.state;

    return (
      <div className="login-main">
        
        <div className="card login-card">
          <img src={InstagramTextLogo} className="card-img-top" alt="Instagram Text Logo" />

          <div className="card-body">
            
            <form onSubmit={this.onSubmit}>

              <div className="form-group">
                <input
                  type="text" 
                  className={classnames('form-control', {
                    'is-invalid':errors.email
                  })} 
                  placeholder="Email" 
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange} />

                  {errors.email ? (<div className="invalid-feedback">{errors.email}</div>) : null }
              </div>

              <div className="form-group">
                <input 
                  type="Password" 
                  className={classnames('form-control', {
                    'is-invalid':errors.password
                  })} 
                  placeholder="Password" 
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange} />

                  {errors.password ? (<div className="invalid-feedback">{errors.password}</div>) : null }
              </div>

              <button type="submit" className="btn btn-primary login-btn">Log In</button>
            </form>
          
          </div>
        </div>
  
        <div className="card no-account">
          <div className="card-body">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
  
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
