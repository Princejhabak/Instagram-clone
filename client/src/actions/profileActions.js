import axios from 'axios';

import {
    GET_USER_PROFILE,
    GET_CURRENT_USER_PROFILE,
    PROFILE_LOADING,
    PROFILE_LOADED,
    CLEAR_CURRENT_PROFILE,
    GET_ERRORS
} from './types';

// Get current profile
export const getCurrentUserProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_CURRENT_USER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get user profile
export const getUserProfile = (username) => dispatch => {

    dispatch(setProfileLoading());

    axios
      .get(`/api/profile/${username}`)
      .then(res =>
        dispatch({
          type: GET_USER_PROFILE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }; 

  export const updateUserProfile = (newProfile, history) => dispatch => {

    dispatch(setProfileLoading());

    axios.post('/api/profile/update', newProfile)
      .then(res => {
        const {username} = res.data.user;
        history.push(`/profile/${username}`);
      })
      .catch(err => {

        dispatch(setProfileLoaded());

        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    );
  
  }

  export const updateUserProfilePicture = (data, history) => dispatch => {

    dispatch(setProfileLoading());

    axios.post('/api/profile/profile_picture/upload',data)
      .then(res => {
        const {username} = res.data;
        history.push(`/profile/${username}`);
      })
      .catch(err => {

        dispatch(setProfileLoaded());

        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    );
  
  }

  export const removeUserProfilePicture = (history) => dispatch => {

    dispatch(setProfileLoading());

    axios.post('/api/profile/profile_picture/remove')
      .then(res => {
        const {username} = res.data;
        history.push(`/profile/${username}`);
      })
      .catch(err => {

        dispatch(setProfileLoaded());

        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    );
  
  }

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Profile loaded
export const setProfileLoaded = () => {
  return {
    type: PROFILE_LOADED
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
