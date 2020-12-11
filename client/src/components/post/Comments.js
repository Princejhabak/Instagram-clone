import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';

import './comments.css';


class Comments extends Component {

    constructor(props){
        super(props);
        this.state = {
            post: {},
            comment: ''
        }
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        axios.get(`/api/posts/comments/${params.postId}`)
            .then(res => {
                this.setState({
                    post: res.data
                });
            })
            .catch(e => console.log(e.response.data));
    }

    onChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        
        const newComment = {
            text: this.state.comment,
        };

        const { match: { params } } = this.props;
        axios.post(`/api/posts/comment/${params.postId}`, newComment)
            .then(res => {
                this.setState({
                    post: res.data
                });
            })
            .catch(e => console.log(e.response.data));

    }

    render(){
        
        const {comments} = this.state.post; 

        return(

            <div className="card comment-main">

                <div className="card-header text-center">
                    Add a comment
                </div>

                <div className="card-body comment-body p-1">
                {
                    comments ?
                    comments.map(comment => {
                        return(
                            
                            <div key={comment._id} className="row">
                                <div className="col-2 text-center">
                                    <img className="rounded-circle mt-2 ml-2" src={comment.user.avatar} alt="profile" width="24px" height="24px" />
                                </div>
                                <div className="col-10">
                                    <small><b>{comment.user.username}</b> {comment.text}</small><br/>
                                    <small className="text-muted">{moment(comment.date, "YYYYMMDD").fromNow()}</small>
                                </div>
                            </div>  
                            
                        )
                    }) :
                    <small>No comments yet</small>
                }
                </div>

                <div className="card-footer text-muted p-0">
                    <form className="form-inline" onSubmit={this.onSubmit}>
                        <div className="form-group" style={{width: "86%"}}>
                            <input type="textarea" className="form-control form-control-sm" placeholder="Add a comment" name="comment" style={{width: "100%"}} onChange={this.onChange} />
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">Post</button>
                    </form>
                </div>

            </div>
            
        );
    }
}

export default Comments;