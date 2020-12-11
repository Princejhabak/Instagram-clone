import React, {Component} from 'react';
import axios from 'axios';

import Post from './post/Post';

import Spinner from './utils/Spinner';

class Homepage extends Component {

  constructor(props){
    super(props);
    this.state = {
      posts : []
    }
  }
  
  componentDidMount(){
    axios.get('/api/posts/')
      .then(res => {

        this.setState({
          posts: res.data
        })
  
      })
      .catch(e => console.log(e));
  }

  render(){
    return(
      <div className="container post-container">
        {
          this.state.posts.length !== 0 ?

          this.state.posts.map(post => (
            <Post key={post.id} post={post}/>
          )) :
          <Spinner />
        }
      </div>	
    );
  }
  
}

export default Homepage;
