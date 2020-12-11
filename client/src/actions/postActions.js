import axios from 'axios';

import {
    GET_ERRORS,
    POST_LOADING,
    POST_LOADED
} from '../actions/types';

export const createPost = (postData, history) => dispatch => {

    dispatch(setPostLoading());

    axios.post('/api/posts/create', postData)
        .then(res => {
            dispatch(setPostLoaded());
            history.push('/')
        })
        .catch(err => {
            dispatch(setPostLoaded());
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        }
        
    );

}


// Post loading
export const setPostLoading = () => {
    return {
      type: POST_LOADING
    };
};

// Post loaded
export const setPostLoaded = () => {
    return {
      type: POST_LOADED
    };
};