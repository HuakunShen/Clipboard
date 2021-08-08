import React from 'react';
import Navbar from '../Navbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import '../../stylesheets/ClipboardIntro.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333333',
    },
  },
});

const ClipboardIntro = () => {
  return (
    <ThemeProvider theme={theme}>
      <Navbar color='primary' position='fixed' />
      <div className='clipboard-intro'>
        <div className='container'>
          <h1>
            Intro to Clipboard (Sign In To Use This App){' '}
            <Link
              to='/signin'
              style={{ color: '#ffffff', textDecoration: 'none' }}
            >
              <Tooltip title='Sign In'>
                <IconButton color='inherit'>
                  <i
                    className='fas fa-sign-in-alt'
                    style={{ color: '#dddddd' }}
                  ></i>
                </IconButton>
              </Tooltip>
            </Link>
          </h1>

          <br />
          <h2>Goal</h2>
          <p>
            This app is designed as a cross-platform clipboard that you can use
            on any browser.
          </p>
          <br />
          <h2>Inspiration</h2>
          <p>
            It is a pain when I need to transfer files or text from one device
            to another.
          </p>
          <p>
            Apple's devices do a great job with <strong>AirDrop</strong> and{' '}
            <strong>Handoff</strong>. But I also use windows 10 and Linux.
          </p>
          <p>
            When I want to transfer transfer text/file from my Linux machine to
            my Mac, or from my Phone to my Windows Machine, it is always very
            inconvenient.
          </p>
          <p>
            Emails can be used to transfer text/files. Cloud drives can also be
            used to transfer files. But they are not easy to use in my personal
            experience. The procedure of sending text and files are usually too
            complicated, sometimes even need to re-signin and use my phone for
            verification.
          </p>
          <p>So I made this app to make my life easier.</p>
          <p>
            Uploading text takes one click on the buttons. You don't even need
            to <code>ctrl c</code>, <code>ctrl v</code>.
          </p>
          <p>File uploading supports drag and drop.</p>
          <br />
          <h2>Usage</h2>
          <p>
            You can upload your text and files to the clipboard and view the
            information on another device with a browser.
          </p>
          <p>
            To use this app, you have to have an account first. From the
            navigation bar above, click Sign In if you have an account or Sign
            Up if you don't.
          </p>
          <p>
            The authentication lasts 30 days, so you don't need to login very
            often.
          </p>
          <br />
          <h2>Clipboard Panel</h2>
          <img src='/img/clipboard.png' alt='' />
          <h3>Upload Text</h3>
          <img src='/img/clipboard-text.gif' alt='' />
          <h3>Upload File</h3>
          <img src='/img/clipboard-file.gif' alt='' />
          <br />
          <br />
          <br />
          <h3>Sharing Clipboard</h3>
          <img src='/img/clipboard-share.png' alt='' />
          <img src='/img/clipboard-share.gif' alt='' />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ClipboardIntro;
