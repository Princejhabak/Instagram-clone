import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

import { getUserProfile } from '../../actions/profileActions';

import Spinner from '../utils/Spinner';
import ProfilePost from './ProfilePost';
import ProfileHeader from './ProfileHeader';

class Profile extends Component {

    componentDidMount(){
        const { match: { params } } = this.props;
        this.props.getUserProfile(params.username);
    }

    render(){

        const currentUser = this.props.auth.user;
        const {profile, loading} = this.props.profile;
        
        let pageContent;

        if (loading || profile === null) {
            pageContent = (<Spinner />);
        } 
        else{
            
            pageContent = (
                <div className="container"> 
                    
                    <ProfileHeader currentUser={currentUser} user={profile.user} profile={profile}/>
                    <br/><br/>
                    <ul className="nav nav-pills">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/profile">POSTS</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/profile">SAVED</Link>
                    </li>
                    </ul>
                    <br/>

                    <div className="row">
                        {
                            profile.posts.length === 0 ?
                            <div>
                                <h1 style={{marginTop: "32px"}}>No Posts Yet</h1>
                            </div> :
                            profile.posts.map((post) => 
                                <ProfilePost key={post._id} data={post} />
                            )
                        }
                    </div>
                            
                </div>
            )
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
    auth: state.auth
  });
  
  export default connect(mapStateToProps, { getUserProfile })(Profile);
