import React, {Component} from 'react';

import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';

class PostHeader extends Component {
    render(){

        const {post} = this.props;

        return(
            <div className="card-header" style={{backgroundColor: "white"}}>

                <div className="row">
                  <div className="col-sm-1">
                    <img className="rounded-circle mt-2" src={post.user.avatar} alt="profile" width="32px" height="32px"/>
                  </div>
                  <div className="col-sm-10">
                    <small><b>{post.user.username}</b></small> <br/>
                    {
                        post.location ?
                        <small>{post.location}</small> :
                        null
                    }
                  </div>
                  <div className="col-sm-1">
                    <MoreHorizSharpIcon />
                  </div>
                </div>
                  
            </div>
        );  
    }
}

export default PostHeader;