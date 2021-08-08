import { LOAD_AUTH, CLEAR_AUTH } from '../actions/actionTypes';

const auth = (state = { isAuthenticated: false }, action) => {
  switch (action.type) {
    case LOAD_AUTH:
      return action.auth;
    case CLEAR_AUTH:
      return { isAuthenticated: false }; // clear user/auth, set space to empty object
    default:
      return state;
  }
};

export default auth;
