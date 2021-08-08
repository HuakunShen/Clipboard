import React, { useState, useEffect } from 'react';
import '../stylesheets/Signin.scss';
import Alert from '@material-ui/lab/Alert';
import { withRouter } from 'react-router-dom';
import Loader from './Loader';
import $ from 'jquery';
import Axios from 'axios';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../lib/redux_helper';
import Navbar from '../components/Navbar';

const Signin = (props) => {
  const [msg, setMsg] = useState(null),
    [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (props.auth && props.auth.isAuthenticated) {
      props.history.push('/clipboard');
    }
  }, [props.auth, props.auth.isAuthenticated, props.history]);

  const submit = (e) => {
    e.preventDefault();
    setMsg(null);
    const username = $('input[name="username"]').val();
    const password = $('input[name="password"]').val();
    if (!(username && password)) {
      setMsg('All Fields Must Be Filled In');
      setTimeout(() => setMsg(null), 5000);
      return;
    }

    Axios.post('/api/users/login', {
      username,
      password,
    })
      .then((res) => {
        props.loadAuth();
        setMsg(res.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        setMsg(err.response.data);
        setTimeout(() => {
          setMsg(null);
        }, 5000);
      });
  };

  return (
    <div className='signin-page'>
      <Navbar />
      {msg ? (
        loggedIn ? (
          <Alert variant='filled' severity='success'>
            {msg}
          </Alert>
        ) : (
          <Alert variant='filled' severity='error'>
            {msg}
          </Alert>
        )
      ) : null}
      <Loader />
      <div className='container'>
        <form className='box' onSubmit={submit}>
          <h1>Sign In</h1>
          <input type='text' name='username' placeholder='Username' />
          <input type='password' name='password' placeholder='Password' />
          <input type='submit' name='login' value='Login' />
        </form>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signin));
