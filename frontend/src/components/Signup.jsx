import React, { Component } from 'react';
import '../stylesheets/Signup.scss';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Loader from './Loader';
import { withRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../lib/redux_helper';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameRef: React.createRef(),
      emailRef: React.createRef(),
      passwordRef: React.createRef(),
      errMsg: null,
    };
  }

  componentDidMount() {
    if (this.props.auth && this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.multipleClickEvent);
  }

  submit = async (event) => {
    event.preventDefault();
    this.setState({ errMsg: null });
    const username = this.state.usernameRef.current.value;
    const email = this.state.emailRef.current.value;
    const password = this.state.passwordRef.current.value;
    if (!(username && email && password)) {
      this.setState({ errMsg: 'All Fields Must Be Filled In' }, () =>
        setTimeout(() => this.setState({ errMsg: null }), 5000)
      );
      return;
    }
    try {
      await axios.post('/api/users/', {
        username,
        email,
        password,
      });
      this.props.loadAuth();
      this.props.history.push('/');
    } catch (error) {
      if (error.response.data.message)
        this.setState({ errMsg: error.response.data.message }, () =>
          setTimeout(() => this.setState({ errMsg: null }), 5000)
        );
    }
  };

  render() {
    return (
      <div className='signup-page'>
        <Navbar />
        {this.state.errMsg && (
          <Alert variant='filled' severity='error'>
            {this.state.errMsg}
          </Alert>
        )}
        <Loader />
        <div className='container'>
          <form className='box' onSubmit={this.submit}>
            <h1>Sign Up</h1>
            <input
              type='text'
              name='username'
              placeholder='Username'
              ref={this.state.usernameRef}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              ref={this.state.emailRef}
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              autoComplete='off'
              ref={this.state.passwordRef}
            />
            <input type='submit' name='signup' value='Sign Up' />
          </form>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup));
