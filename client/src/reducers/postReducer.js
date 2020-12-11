import {
    POST_LOADING,
    POST_LOADED
} from '../actions/types';

const initialState = {
    post: null,
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case POST_LOADING:
            return {
                ...state,
                loading: true
        };
        case POST_LOADED:
            return {
                ...state,
                loading: false
        };
        default:
            return state;
    }
    
}