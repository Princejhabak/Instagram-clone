import React, { Component } from "react";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';

import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';

import InstagramTextLogo from '../../assets/images/instagram-text-logo.jpg';
import './navbar.css'

class Navbar extends Component {

    constructor(props){
        super(props);
        this.state = {
            matchingUsers: [],
            showSearchInput: false
        }
    }

    componentDidMount() {
        if (!this.props.auth.isAuthenticated) {
          this.props.history.push('/login');
        }
    }

    handleLogout = (e) => {
        e.preventDefault();
        this.props.clearCurrentProfile();
        this.props.logoutUser();
        this.props.history.push('/login');
    }

    handleSearchTermChange = (e) =>{

        this.setState({
            showSearchInput: true
        });

        const body = {
            searchTerm: e.target.value
        } 
        axios.post('/api/users/search', body)
            .then(res => {
                this.setState({
                    matchingUsers: res.data
                })
            })
            .catch(e => console.log(e));
    }

    handleSearchItemClicked = (user) => {
        this.setState({
            showSearchInput: false
        });

        $('#searchInput').val('');

        this.props.history.push(`/profile/${user.username}`);
    }

    render(){

        const {user} = this.props.auth;

        return(    

            <div className="" style={{marginBottom: "32px"}}>
                <nav className="navbar navbar-expand-lg navbar-light bg-white">
                    <div className="collapse navbar-collapse row">

                        <div className="col">
                            <Link className="navbar-brand" to="/">
                                <img src={InstagramTextLogo} alt="Instagram Text Logo" style={{height: "48px"}} />
                            </Link>
                        </div>

                        <div className="col">
                            <form className="form-inline" autoComplete="off">
                                <input 
                                    className="form-control" 
                                    name="searchTerm" 
                                    onChange={this.handleSearchTermChange} 
                                    type="search" 
                                    id="searchInput" 
                                    placeholder="Search" 
                                    aria-label="Search"/>
                            </form>
                        </div>

                        <div className="col mr-auto">
                            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/"><HomeOutlinedIcon /></Link>
                                </li >
                                <li className="nav-item">
                                    <Link className="nav-link" to="/post/create"><PostAddOutlinedIcon /></Link>
                                </li >
                                <li className="nav-item">
                                    <Link className="nav-link" to={`/profile/${user.username}`}><img className="rounded-circle" src={user.avatar} alt="avatar" width="22px" height="22px"/></Link>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="nav-link" 
                                        onClick={this.handleLogout}
                                        style={{cursor: 'pointer'}}><ExitToAppOutlinedIcon /></a>
                                </li>
                            </ul>
                        </div>    

                    </div>
                </nav>

                {
                    this.state.showSearchInput ?
                    <div className="list-group">

                        {
                            this.state.matchingUsers.map(user => {
                                return(
                                    <div className="list-group-item list-group-item-action py-0 px-2" key={user.id} onClick={() => this.handleSearchItemClicked(user)} style={{cursor: "pointer"}}>
                                        <div className="row">
                                            <div className="col-3">
                                                <img className="rounded-circle mt-1" src={user.avatar} alt="profile" width="36px" height="36px"/>
                                            </div>
                                            <div className="col-9">
                                                <small className="text-dark"><b>{user.username}</b></small><br/>
                                                <small className="text-dark">{user.name}</small>
                                            </div>
                                        </div>                                        
                                    </div>
                                );
                            })
                        }

                    </div>:
                    null
                }
                
            </div>
        );
    }

}

const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(Navbar);