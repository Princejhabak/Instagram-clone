import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';

import InstagramTextLogo from '../../assets/images/instagram-text-logo.jpg';
import './register.css';

class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      email: '',
      username: '',
      password: '',
      password2: '',
      errors:{}
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    }

    this.props.registerUser(newUser, this.props.history);
    
  }

  render(){
    const {errors} = this.state;
    
    return (
      <div className="register-main">
        <div className="card register-card">

          <img src={InstagramTextLogo} className="card-img-top" alt="Instagram Text Logo" />
          <p className="register-heading">Sign up to see photos and videos<br/>from your friends.</p>
          
          <div className="card-body">
            
            <form onSubmit={this.onSubmit}>

              <div className="form-group">
                <input 
                  type="text" 
                  className={classnames('form-control', {
                    'is-invalid':errors.name
                  })} 
                  placeholder="Full Name" 
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange} />

                  {errors.name ? (<div className="invalid-feedback">{errors.name}</div>) : null }
              </div>

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
                  type="text"
                  className={classnames('form-control', {
                    'is-invalid':errors.username
                  })} 
                  placeholder="Username" 
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange} />

                  {errors.username ? (<div className="invalid-feedback">{errors.username}</div>) : null }
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

              <div className="form-group">
                <input 
                  type="Password" 
                  className={classnames('form-control', {
                    'is-invalid':errors.password2
                  })} 
                  placeholder="Confirm Password" 
                  name="password2"
                  value={this.state.password2}
                  onChange={this.onChange} />

                  {errors.password2 ? (<div className="invalid-feedback">{errors.password2}</div>) : null }
              </div>

              <button type="submit" className="btn btn-primary register-btn">Sign Up</button>
            </form>
          
          </div>
        </div>

        <div className="card have-account">
          <div className="card-body">
            <p>Have an account? <Link to="/login">Log In</Link></p>
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

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
