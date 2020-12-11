import {
    GET_USER_PROFILE,
    GET_CURRENT_USER_PROFILE,
    PROFILE_LOADING,
    PROFILE_LOADED,
    CLEAR_CURRENT_PROFILE
} from '../actions/types';
  
const initialState = {
    profile: null,
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case PROFILE_LOADED:
                return {
                    ...state,
                    loading: false
                };
        case GET_CURRENT_USER_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            };
        case GET_USER_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            };
        default:
            return state;
    }
}
