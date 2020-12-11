import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class ProfileHeader extends Component {

    render(){

        const {currentUser} = this.props;
        const {user} = this.props;
        const {profile} = this.props;
       
        return(
            <div className="row">

                <div className="col-3 pl-5">
                    <div>
                        <img className="rounded-circle" src={user.avatar} alt="profiles" width="160px" height="160px"/>
                    </div>
                    </div>
                <div className="col-9">
                    
                    <div className="mb-2">
                        <strong style={{marginRight: "16px"}}>{user.username}</strong>
                        {
                            currentUser.id === user._id ?
                            <Link className="btn btn-outline-secondary" to={`/profile/update`}>Edit Profile</Link> :
                            null
                        }
                        
                    </div>

                    <div className="mb-3">
                        <small style={{marginRight: "16px"}}><b>19</b> posts</small>
                        <small style={{marginRight: "16px"}}><b>167</b> followers</small>
                        <small><b>402</b> following</small>
                    </div>

                    <div>
                        <small style={{fontSize: "1em"}}>{user.name}</small><br/>
                        
                        {
                            profile.profile.website ? 
                            (   
                                <div>
                                    <small style={{fontSize: "1em"}}>
                                        <a href={profile.profile.website}>
                                            {profile.profile.website}
                                        </a>
                                    </small><br/>    
                                </div>
                            ): 
                            null
                        }
                        {
                            profile.profile.bio ? 
                            (
                                <small style={{fontSize: "1em"}}>{profile.profile.bio}</small>
                            ): 
                            null
                        }
                    </div>

                </div>
            </div>
            
        );
    }

}

export default ProfileHeader;