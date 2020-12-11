import React, {Component} from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import $ from 'jquery';

import { createPost } from '../../actions/postActions';

import Spinner from '../utils/Spinner';

class CreatePost extends Component {

    constructor(props){
        super(props);
        this.state = {
            location: '',
            description: '',
            file: {},
            errors: {}
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

    readUrl = (e) =>{
        
        if (e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#preview')
                    .attr('src', e.target.result)
                    .width(250)
                    .height(200);
            };

            reader.readAsDataURL(e.target.files[0]);
        }

        const file = e.target.files[0];
        
        this.setState({
            file,
            errors: {}
        });


    }

    onSubmit = (e) => {
        e.preventDefault();

        let data = new FormData();
        data.append('file', this.state.file);
        data.append('location', this.state.location);
        data.append('description', this.state.description);

        this.props.createPost(data, this.props.history)

    }

    render(){

        const errors = this.state.errors;
        const {loading} = this.props.post;

        let pageContent;

        if (loading) {
            pageContent = (<Spinner />);
        } 
        else{
            pageContent = (
                <div className="container">
                    <div className="p-5 mb-5 bg-white" style={{width: "40vw"}}>

                        <div className="form-group mb-5">
                            <input
                                className={classnames('', {
                                    'is-invalid':errors.imageUrl
                                })}
                                type="file"
                                name="file"
                                onChange={this.readUrl} 
                                style={{marginBottom: "32px"}}/>
                                
                            {errors.imageUrl ? (<div className="invalid-feedback">{errors.imageUrl}</div>) : null }
                            
                            <br/>
                            <img id="preview" ref="preview" src="#" alt="Preview" />
                        </div>

                        <form onSubmit={this.onSubmit}>

                            <div className="form-group">
                                <label htmlFor="webiste">Location</label>
                                <input
                                    id="location"
                                    type="text" 
                                    className="form-control"
                                    name="location"
                                    value={this.state.location}
                                    onChange={this.onChange} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Description</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.onChange} />
                            </div>

                            <button type="submit" className="btn btn-primary mr-3">Post</button>
                            <Link to="/" className="btn btn-outline-danger">Cancel</Link>
                        </form>
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
    auth: state.auth,
    errors: state.errors,
    post: state.post
});

export default connect(mapStateToProps, {createPost})(withRouter(CreatePost));
