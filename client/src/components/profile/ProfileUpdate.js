import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';

import { 
    getCurrentUserProfile, 
    updateUserProfile,
    updateUserProfilePicture,
    removeUserProfilePicture
} from '../../actions/profileActions';

import Spinner from '../utils/Spinner';

class ProfileUpdate extends Component{

    constructor(props){
        super(props);

        this.state = {
            name: '',
            username: '',
            website: '',
            bio: '',
            file: {},
            errors: {}
        }

    }

    componentDidMount(){
        this.props.getCurrentUserProfile();
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.profile.loading && nextProps.profile.profile !== null){
            
            const {profile} = nextProps.profile;    

            this.setState({
                name: profile.user.name,
                username: profile.user.username,
                website: profile.profile.website,
                bio: profile.profile.bio,
            });
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

        const newProfile = {
            name: this.state.name,
            username: this.state.username,
            website: this.state.website,
            bio: this.state.bio,
        }

        this.props.updateUserProfile(newProfile, this.props.history);
    
    }

    setCurrentImage = (e) => {
        let file = e.target.files[0];
        
        this.setState({
            file
        });
        
    }

    handlePhotoRemoval = (e) => {
        this.props.removeUserProfilePicture(this.props.history);
    }

    handlePhotoUpload = (e) => {
        let data = new FormData();
        data.append('file', this.state.file);

        this.props.updateUserProfilePicture(data, this.props.history)
    }

    render(){
        
        let errors = {};
        if(this.state) errors = this.state.errors;
        
        //const {user} = this.props.auth;
        const {profile, loading} = this.props.profile;

        let pageContent;

        if (loading || profile === null) {
            pageContent = (<Spinner />);
        } 
        else{
            pageContent = (
                <div className="container">
                    <div className="p-5 mb-5 bg-white" style={{width: "40vw"}}>

                        <div className="mb-5">
                            <img className="rounded-circle" src={profile.user.avatar} alt="profiles" width="160px" height="160px"/>
                            
                            <div className="mt-5">
                                <div className="form-group">
                                    <input
                                    className={classnames('', {
                                        'is-invalid':errors.imageUrl
                                    })}
                                    type="file"
                                    name="file" 
                                    onChange={this.setCurrentImage}/>

                                    {errors.imageUrl ? (<div className="invalid-feedback">{errors.imageUrl}</div>) : null }
                                </div>

                                <button className="btn btn-primary" onClick={this.handlePhotoUpload}>Upload</button><br/>
                            
                                <button className="btn btn-outline-danger mt-2" onClick={this.handlePhotoRemoval}>Remove</button>
                            </div>
                        </div>

                        <form onSubmit={this.onSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    id="name"
                                    type="text" 
                                    className={classnames('form-control', {
                                        'is-invalid':errors.name
                                    })}
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.onChange} />

                                {errors.name ? (<div className="invalid-feedback">{errors.name}</div>) : null }
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username *</label>
                                <input 
                                    type="text" 
                                    className={classnames('form-control', {
                                    'is-invalid':errors.username
                                    })} 
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.onChange} />

                                    {errors.username ? (<div className="invalid-feedback">{errors.username}</div>) : null }
                            </div>

                            <div className="form-group">
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    type="text" 
                                    className="form-control"
                                    name="website"
                                    value={this.state.website}
                                    onChange={this.onChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Bio</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="bio"
                                    value={this.state.bio}
                                    onChange={this.onChange} />
                            </div>

                            <button type="submit" className="btn btn-primary mr-3">Save</button>
                            <button type="cancel" className="btn btn-outline-danger">Cancel</button>
                        </form>
                    </div>
                </div>
            );
        }

        return(
            <div>
                {pageContent}
            </div>
        );
    }

}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth,
    errors: state.errors
});
  
export default connect(
    mapStateToProps, {
        getCurrentUserProfile, 
        updateUserProfile,
        updateUserProfilePicture,
        removeUserProfilePicture
    })(withRouter(ProfileUpdate));