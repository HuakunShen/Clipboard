import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import '../../stylesheets/ShareableClipboard.scss';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import Navbar from '../Navbar';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: darkTheme.palette.background.default,
    padding: '2em',
    marginTop: '1em',
    color: darkTheme.palette.text.primary,
  },
  textField: {
    marginTop: '1em',
  },
}));

const ShareableClipboard = (props) => {
  const classes = useStyles(darkTheme);
  const [clipboards, setClipboards] = useState([]),
    [clipboardsFiles, setClipboardsFiles] = useState([]),
    [clipboardsTexts, setClipboardsTexts] = useState([]),
    [msg, setMsg] = useState(null);

  const retrieveClipboards = async () => {
    try {
      const res = await Axios.get(`/api/clipboards/${props.match.params.id}`);
      setClipboards(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // setup clipboard
  useEffect(() => {
    window.Clipboard = (function (window, document, navigator) {
      var textArea, copy;

      function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
      }

      function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
      }

      function selectText() {
        var range, selection;

        if (isOS()) {
          range = document.createRange();
          range.selectNodeContents(textArea);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          textArea.setSelectionRange(0, 999999);
        } else {
          textArea.select();
        }
      }

      function copyToClipboard() {
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      copy = function (text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
      };

      return {
        copy: copy,
      };
    })(window, document, navigator);
  }, []);

  // get clipboard id from params, and retrieve data from database
  useEffect(() => {
    retrieveClipboards();
    // eslint-disable-next-line
  }, [props.match.params]);

  // parse texts and files clipboards
  useEffect(() => {
    const files = [];
    const texts = [];
    clipboards.forEach((clipboard) => {
      if (clipboard.type === 'file') {
        files.push(clipboard);
      } else if (clipboard.type === 'text' && clipboard.content) {
        texts.push(clipboard);
      } else {
        console.error('error, unexpected filetype');
        console.error(clipboard.type);
      }
    });
    setClipboardsFiles(files);
    setClipboardsTexts(texts);
  }, [clipboards]);

  const copy = (index) => {
    window.Clipboard.copy(clipboardsTexts[index].content);
    setMsg(`Copied: ${clipboardsTexts[index].content}`);
    setTimeout(() => {
      setMsg(null);
    }, 3000);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={`shareable-clipboard-page ${classes.page}`}>
        <Navbar />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={msg ? true : false}
          onClose={() => setMsg(null)}
          message={msg}
        />
        <Container>
          <h1>Clipboard</h1>
          <Paper className={classes.paper} elevation={3}>
            <h2>Texts</h2>
            <List dense={false}>
              {clipboardsTexts.map((text, index) => {
                return (
                  <ListItem key={index}>
                    <TextField
                      id='filled-read-only-input'
                      label={`Text ${index + 1}`}
                      defaultValue={text.content}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      variant='outlined'
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title='Copy' placement='right'>
                        <IconButton
                          edge='end'
                          aria-label='delete'
                          onClick={() => copy(index)}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          <Paper className={classes.paper} elevation={3}>
            <h2 className='mb-3'>Files</h2>
            <div className='files-clipboard-list'>
              {clipboardsFiles.map((file, index) => {
                return (
                  <a
                    href={file.content.Location}
                    alt={file.content.filename}
                    className='file-container'
                  >
                    <div>
                      <i className='far fa-file-alt'></i>
                    </div>
                    <figurecaption style={{ wordBreak: 'break-all' }}>
                      {file.content.filename}
                    </figurecaption>
                  </a>
                );
              })}
            </div>
          </Paper>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default withRouter(ShareableClipboard);
