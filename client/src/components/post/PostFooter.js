import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BookmarkBorderSharpIcon from '@material-ui/icons/BookmarkBorderSharp';
//import BookmarkSharpIcon from '@material-ui/icons/BookmarkSharp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

class PostFooter extends Component {

    constructor(props){
        super(props);

        this.state = {
            likes: [],
            toggleLike: false
        }
    }

    componentWillMount(){
        const {likes} = this.props.post;

        this.setState({
            likes: likes,
            toggleLike: this.findUserLike(likes)
        });

    }

    handleLike = (id) => {
        axios.post(`/api/posts/like/${id}`)
            .then(res => {

                this.setState({
                    likes: res.data.likes,
                    toggleLike: !this.state.toggleLike
                })

            })
            .catch(e => console.log(e.response.data))
    }

    handleDislike = (id) => {
        axios.post(`/api/posts/unlike/${id}`)
            .then(res => {

                this.setState({
                    likes: res.data.likes,
                    toggleLike: !this.state.toggleLike
                })

            })
            .catch(e => console.log(e.response.data))
    }

    findUserLike = (likes) => {
        const {user} = this.props.auth;
        
        if(likes.filter(like => like.user === user.id).length > 0){
            return true;
        }
        else{
            return false;
        }
      
    }

    render(){

        const {post} = this.props;
        const postDate = moment(post.date, "YYYYMMDD").fromNow();

        return(
            <div className="card-footer" style={{backgroundColor: "white"}}>
                <div>
                    <div className="float-left">
                        {
                            this.state.toggleLike ?
                            <FavoriteIcon onClick={() => this.handleDislike(post._id)} className="text-danger" style={{cursor: "pointer"}}/> :
                            <FavoriteBorderIcon onClick={() => this.handleLike(post._id)} style={{cursor: "pointer"}}/>
                        }
                        
                    </div>
                    
                    <div className="float-left ml-3">
                        <ChatBubbleOutlineIcon />
                    </div>

                    <div className="float-right">
                        <BookmarkBorderSharpIcon />
                    </div>
                </div>
                
                <br/>
                <small>
                {
                    post.description ?
                    <div>
                        <br/>{post.description}
                    </div>:
                    null
                }
                </small>

                <br/>
                <small>
                {
                    this.state.likes.length === 1 ?
                    <b>{this.state.likes.length} Like</b>:
                    <b>{this.state.likes.length} Likes</b>

                }
                </small>

                <br/>
                <small>
                {
                    post.comments.length === 1 ?
                    <Link to={`/post/${post._id}/comment`}>{post.comments.length} Comment</Link>:
                    <Link to={`/post/${post._id}/comment`}>{post.comments.length} Comments</Link>

                }
                </small>
                
                <br/>
                <small>{postDate}</small>
                  
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
  
  export default connect(mapStateToProps)(PostFooter);