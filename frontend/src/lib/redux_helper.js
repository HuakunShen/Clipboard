import axios from 'axios';
import { changeAuth } from '../redux/actions';
import { LOAD_AUTH, CLEAR_AUTH } from '../redux/actions/actionTypes';

export const mapStateToProps = (state) => ({
  auth: state.auth,
});

export const loadAuth = (dispatch) => {
  axios
    .get('/api/users/load_auth')
    .then((res) => {
      const auth = res.data;
      dispatch(
        changeAuth(LOAD_AUTH, Object.assign(auth, { isAuthenticated: true }))
      );
    })
    .catch((err) => {
      dispatch(changeAuth(LOAD_AUTH, { isAuthenticated: false }));
      console.error(err);
    });
};

export const logout = (dispatch) => {
  axios
    .post('/api/users/logout')
    .then((res) => {})
    .catch((err) => {
      console.error('error: ', err);
    });
  dispatch(changeAuth(CLEAR_AUTH, null));
};

export const mapDispatchToProps = (dispatch) => {
  return {
    loadAuth: () => loadAuth(dispatch),
    logout: () => logout(dispatch),
  };
};
