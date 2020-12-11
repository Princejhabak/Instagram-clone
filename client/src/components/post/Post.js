import React, {Component} from 'react';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

import './post.css';

class Post extends Component {

    render(){

        const {post} = this.props;
        
        return(

            <div className="row" style={{marginBottom: "32px"}}>
                <div className="col-md-1"></div>
                <div className="col-md-6">

                <div className="card">

                    <PostHeader post={post}/>

                    <div className="card-body" style={{padding: "0"}}>
                        <img className="post-body" src={post.imageUrl} alt="profile" />
                    </div>

                    <PostFooter post={post}/>
                </div>

                </div>
                <div className="col-md-5"></div>
            </div>
      
           
        );
    }
}

export default Post;