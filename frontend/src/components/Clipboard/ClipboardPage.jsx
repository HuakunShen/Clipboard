import React, { useState, useEffect } from 'react';
import '../../stylesheets/Clipboard.scss';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withRouter, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import DragNdrop from './DragNdrop';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import Tooltip from '@material-ui/core/Tooltip';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux';
import Navbar from '../Navbar';
import { mapStateToProps, mapDispatchToProps } from '../../lib/redux_helper';
import Axios from 'axios';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: darkTheme.spacing(1),
      width: '25ch',
    },
  },
  main_paper: {
    borderRadius: 0,
  },
  textfield: {
    marginBottom: '1em',
  },
  content_bg_paper: {
    backgroundColor: '#1e1e1e',
    padding: '2em',
    textAlign: 'center',
  },
  fileCopyIcon: {
    '&:hover': {
      color: '#fffa65',
    },
  },
  CloudUploadIcon: {
    '&:hover': {
      color: '#32ff7e',
    },
  },
  DeleteIcon: {
    '&:hover': {
      color: 'red',
    },
  },
  snackbar: {
    maxWidth: '100%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  alert: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction='down' />;
}

const ClipboardPage = (props) => {
  const classes = useStyles(darkTheme);
  const [clipboards, setClipboards] = useState([]),
    [clipboardsFiles, setClipboardsFiles] = useState([]),
    [clipboardsTexts, setClipboardsTexts] = useState([]),
    [progress, setProgress] = useState(0),
    [errMsg, setErrMsg] = useState(null),
    [successMsg, setSuccessMsg] = useState(null),
    [sharing, setSharing] = useState(false);

  // setup share checkboxes
  const [textChecked, setTextChecked] = useState([]),
    [fileChecked, setFileChecked] = useState([]),
    [selectAll, setSelectAll] = useState(false); // [{state: true/false}]
  const handleTextCheckboxChange = (event, index) => {
    const checked = event.target.checked;
    setTextChecked(
      textChecked.map((item, i) => (index === i ? { state: checked } : item))
    );
  };
  const handleFileCheckboxChange = (event, index) => {
    const checked = event.target.checked;
    setFileChecked(
      fileChecked.map((item, i) => (index === i ? { state: checked } : item))
    );
  };

  useEffect(() => {
    if (sharing) {
      setTextChecked(new Array(clipboardsTexts.length).fill({ state: false }));
      setFileChecked(new Array(clipboardsFiles.length).fill({ state: false }));
    } else {
      setTextChecked([]);
      setFileChecked([]);
    }
    console.log('clipboard page loaded');
    // eslint-disable-next-line
  }, [sharing]);

  useEffect(() => {
    setTextChecked(
      new Array(clipboardsTexts.length).fill({ state: selectAll })
    );
    setFileChecked(
      new Array(clipboardsFiles.length).fill({ state: selectAll })
    );
    // eslint-disable-next-line
  }, [selectAll]);

  const shareSelectedClipboards = async (e) => {
    console.log(e.target);
    const clipboards_id = [];
    textChecked.forEach((checkbox, index) => {
      if (checkbox.state && clipboardsTexts[index]._id) {
        clipboards_id.push(clipboardsTexts[index]._id);
      }
    });
    fileChecked.forEach((checkbox, index) => {
      if (checkbox.state && clipboardsFiles[index]._id) {
        clipboards_id.push(clipboardsFiles[index]._id);
      }
    });
    const res = await Axios.post('/api/clipboards', {
      clipboards_id,
    });
    const { _id } = res.data;
    console.log(_id);
    const url = `https://huakunshen.com/clipboard/${_id}`;
    window.Clipboard.copy(url);
    setSnackbarMsg(
      `Shareable Link Copied to Your Clipboard (The link is valid is 10 minutes): ${url}`
    );
  };

  // useEffect(() => {
  //   setTextChecked(new Array(clipboardsTexts.length).fill({ state: false }));
  // }, [clipboardsTexts.length]);
  // useEffect(() => {
  //   setFileChecked(new Array(clipboardsFiles.length).fill({ state: false }));
  // }, [clipboardsFiles.length]);

  // ========================================================================================================================

  // after copied of paste, update this value, if updated, => copied/pasted => update text to server/db
  const [updateTextIndexPaste, setUpdateTextIndexPaste] = useState(null);

  // setup snackbar
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    Transition: Fade,
  });
  const [snackbarMsg, setSnackbarMsg] = useState(null);

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

  const handleOpenSnackbar = (Transition) => {
    setSnackbarState({
      open: true,
      Transition,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
    setSnackbarMsg(null);
  };

  useEffect(() => {
    if (snackbarMsg) {
      handleOpenSnackbar(SlideTransition);
    } else {
      handleCloseSnackbar();
    }
    // eslint-disable-next-line
  }, [snackbarMsg]);

  const loadClipboards = async () => {
    try {
      const res = await Axios.get('/api/users/clipboards');
      setClipboards(res.data);
      // setup checkboxes
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const files = [];
    const texts = [];
    clipboards.forEach((clipboard) => {
      if (clipboard.type === 'file') {
        files.push(clipboard);
      } else if (clipboard.type === 'text') {
        texts.push(clipboard);
      } else {
        console.log('error, unexpected filetype');
        console.log(clipboard.type);
      }
    });
    setClipboardsFiles(files);
    texts.push({ type: 'text', content: '' });
    setClipboardsTexts(texts);
  }, [clipboards]);

  useEffect(() => {
    // check if logged in
    if (!props.auth || !props.auth.isAuthenticated) {
      props.history.push('/clipboard-intro');
    }
    loadClipboards();
  }, [props.auth, props.history]);

  const dragNdropTransferFiles = async (files) => {
    if (sharing) {
      setSnackbarMsg('Please Exit Sharing Mode To Make Changes');
      setTimeout(() => {
        setSnackbarMsg(null);
      }, 3000);
      return;
    }
    // upload files
    const formData = new FormData();
    formData.append(
      'folder',
      `clipboard${props.auth ? '/' + props.auth._id : ''}`
    );
    Array.from(files).forEach((file) => {
      formData.append('files', file, file.name);
    });
    try {
      const res = await Axios.post('/api/uploads/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setProgress(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });
      console.log(res.data);

      const files = res.data.map((file) => {
        return {
          type: 'file',
          content: {
            Location: file.Location,
            filename: file.filename,
            Key: file.Key,
          },
        };
      });
      console.log(files);

      await Axios.patch('/api/users/clipboards', {
        clipboards: files,
      });
      loadClipboards();
      // reset progress
      setTimeout(() => {
        setProgress(0);
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const textChange = (e, index) => {
    setClipboardsTexts(
      clipboardsTexts.map((text, i) =>
        i === index
          ? { type: 'text', content: e.target.value, _id: text._id }
          : text
      )
    );
  };

  const copyText = (index) => {
    // const copyText = document.querySelector(`#text-${index}`);
    // copyText.select();
    // document.execCommand('copy');
    window.Clipboard.copy(clipboardsTexts[index].content);
    setSnackbarMsg('Copied');
    setTimeout(() => {
      setSnackbarMsg(null);
    }, 1000);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  // ============================================================================
  const pasteText = (index) => {
    console.log('pasteText');
    setUpdateTextIndexPaste(index);
  };

  // for pasting too, trigger paste after clipboard pasted
  // after clipboardsTexts changed, should try to update server/db
  useEffect(() => {
    console.log('useEffect[updateTextIndexPaste]');
    console.log(updateTextIndexPaste);
    if (updateTextIndexPaste !== null) {
      // it can be 0 (index)
      if (!navigator.clipboard) {
        setSnackbarMsg("Device doesn't Support Auto Paste. Paste Manually");
        setTimeout(() => {
          setSnackbarMsg(null);
        }, 3000);
        return;
      }
      navigator.clipboard.readText().then((clipText) => {
        setSnackbarMsg('Pasted');
        setTimeout(() => {
          setSnackbarMsg(null);
        }, 1000);
        setClipboardsTexts((clipboardsTexts) =>
          clipboardsTexts.map((text, i) =>
            i === updateTextIndexPaste
              ? { type: 'text', content: clipText, _id: text._id }
              : text
          )
        );
      });
    }
  }, [updateTextIndexPaste]);
  // ============================================================================

  const setText = async (index) => {
    if (sharing && index === clipboardsTexts.length - 1) {
      // when last text is set, new text box is added, disallow this during sharing which could cause trouble
      setSnackbarMsg('Please Exit Sharing Mode To Make Changes');
      setTimeout(() => {
        setSnackbarMsg(null);
      }, 3000);
      return;
    }

    try {
      const res = await Axios.patch('/api/users/clipboard-text', {
        text: clipboardsTexts[index],
      });

      // loadClipboards();
      // load clipboard will erase all other clipboard not submitted
      // instead, we don't load all clipboards, but keep everything the same
      // if this clipboard is the last, we add a new clipboard
      // update id of the current text
      // retrieve from res.data
      if (index === clipboardsTexts.length - 1) {
        // if this is a new text, the newly added clipboard-text should be returned from server
        const newly_added = res.data;
        clipboardsTexts
          .map((text, i) => (i === index ? newly_added : text))
          .concat([{ type: 'text', content: '' }]);
        setClipboardsTexts(
          clipboardsTexts
            .map((text, i) => (i === index ? newly_added : text))
            .concat([{ type: 'text', content: '' }])
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('useEffect: clipboardsTexts');
    // if pasted, updateTextIndex will be set to text index, should update value to server/db
    if (updateTextIndexPaste !== null) {
      // updateTextIndexPaste can be 0 (index)

      // setUpdateTextIndex(index);
      setText(updateTextIndexPaste);
      setUpdateTextIndexPaste(null);
    }
    // setText not in dependencies because could lead to infinite callback otherwise
    // updateTextIndex don't need to be in dependencies
    // eslint-disable-next-line
  }, [clipboardsTexts]);

  const deleteText = async (index) => {
    if (sharing) {
      setSnackbarMsg('Please Exit Sharing Mode To Make Changes');
      setTimeout(() => {
        setSnackbarMsg(null);
      }, 3000);
      return;
    }
    const _id = clipboardsTexts[index]._id;
    if (!_id) {
      setErrMsg('You cannot delete this text');
      setTimeout(() => {
        setErrMsg(null);
      }, 5000);
      return;
    } else {
      try {
        await Axios.delete('/api/users/clipboards', {
          data: [_id],
        });
        setSuccessMsg('Successfully Deleted');
        setTimeout(() => {
          setSuccessMsg(null);
        }, 5000);

        // loadClipboards();
        // cannot loadClipboards, other unsaved ones will be lost, instead, just remove it from the front end
        setClipboardsTexts(clipboardsTexts.filter((text) => text._id !== _id));
      } catch (error) {
        console.log(error);
        setErrMsg('Fail to delete');
        setTimeout(() => {
          setErrMsg(null);
        }, 5000);
      }
    }
  };

  const deleteFile = async (index) => {
    // delete from s3 bucket first
    console.log(clipboardsFiles[index]);

    if (sharing) {
      setSnackbarMsg('Please Exit Sharing Mode To Make Changes');
      setTimeout(() => {
        setSnackbarMsg(null);
      }, 3000);
      return;
    }
    try {
      await Axios.delete('/api/uploads/file', {
        data: { Key: clipboardsFiles[index].content.Key },
      });
      await Axios.delete('/api/users/clipboards', {
        data: [clipboardsFiles[index]._id],
      });
      setSuccessMsg('Successfully Deleted');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
      loadClipboards();
    } catch (error) {
      console.log(error);
      setErrMsg('Fail to Delete');
      setTimeout(() => {
        setErrMsg(null);
      }, 5000);
    }
  };

  const copyFileUrl = (index) => {
    const url = clipboardsFiles[index].content.Location;
    console.log(url);
    console.log(navigator.clipboard);
    window.Clipboard.copy(url);
    setSnackbarMsg('Copied to clipboard: ' + url);
  };
  // return {!props.auth || !props.auth.isAuthenticated ? <ClipboardIntro /> : <ClipboardIntro />}

  return (
    // {!props.auth || !props.auth.isAuthenticated ? <ClipboardIntro /> :
    <ThemeProvider theme={darkTheme}>
      <Paper className={classes.main_paper} elevation={0}>
        {errMsg && (
          <Alert className={classes.alert} variant='filled' severity='error'>
            {errMsg}
          </Alert>
        )}
        {successMsg && (
          <Alert className={classes.alert} variant='filled' severity='success'>
            {successMsg}
          </Alert>
        )}
        <div className='clipboard-page'>
          <Navbar />

          <Container>
            <h1 style={{ display: 'inline-block' }} className='pt-3'>
              Clipboard{' '}
              <Tooltip title='Clipboard'>
                <Link to='/clipboard-intro' style={{ color: '#ffffff' }}>
                  <IconButton color='inherit'>
                    <FileCopyIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            </h1>
            {sharing ? (
              <div style={{ float: 'right', transform: 'translateY(40%)' }}>
                <Tooltip title='Select All' placement='top'>
                  <IconButton onClick={(e) => setSelectAll(!selectAll)}>
                    <SelectAllIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Cancel' placement='top'>
                  <IconButton onClick={(e) => setSharing(false)}>
                    <CancelScheduleSendIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Share' placement='top'>
                  <IconButton onClick={shareSelectedClipboards}>
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <Tooltip title='Share' placement='top'>
                <IconButton
                  // edge="end"
                  onClick={(e) => setSharing(true)}
                  style={{ float: 'right', transform: 'translateY(40%)' }}
                  aria-label='share'
                >
                  <i className='fas fa-share-square'></i>
                </IconButton>
              </Tooltip>
            )}

            <br />
            <Paper className={classes.content_bg_paper} elevation={3}>
              <List dense={true}>
                {clipboardsTexts.map((text, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Tooltip title='Copy' placement='top'>
                          <IconButton
                            // edge="end"
                            aria-label='copy'
                            onClick={(e) => copyText(index)}
                          >
                            <FileCopyIcon className={classes.fileCopyIcon} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Paste' placement='top'>
                          <IconButton
                            // edge="end"
                            aria-label='paste'
                            onClick={(e) => pasteText(index)}
                          >
                            <i className='fas fa-paste'></i>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Update' placement='top'>
                          <IconButton
                            // edge="end"
                            aria-label='set'
                            onClick={(e) => setText(index)}
                          >
                            <CloudUploadIcon
                              className={classes.CloudUploadIcon}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete' placement='top'>
                          <IconButton
                            edge='end'
                            aria-label='delete'
                            onClick={(e) => deleteText(index)}
                          >
                            <DeleteIcon className={classes.DeleteIcon} />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                      <ListItem>
                        <TextField
                          className={classes.textfield}
                          label={`Text ${index}`}
                          variant='outlined'
                          id={`text-${index}`}
                          multiline
                          value={text.content}
                          onChange={(e) => textChange(e, index)}
                          fullWidth
                        />
                        {textChecked.length <= index ? null : (
                          <Checkbox
                            checked={textChecked[index].state}
                            color='default'
                            style={{ transform: 'translateY(-20%)' }}
                            onClick={(e) => handleTextCheckboxChange(e, index)}
                            // onChange={handleCheckboxChange}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                        )}
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>
            <br />
            <Paper className={classes.content_bg_paper} elevation={3}>
              <DragNdrop transferData={dragNdropTransferFiles} />
              <LinearProgress variant='determinate' value={progress} />
              {
                <div className='files-list'>
                  {clipboardsFiles.map((file, index) => {
                    return (
                      <div key={index} className='file-container'>
                        <div>
                          {fileChecked.length <= index ? null : (
                            <Checkbox
                              checked={fileChecked[index].state}
                              color='default'
                              onClick={(e) =>
                                handleFileCheckboxChange(e, index)
                              }
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                          )}
                        </div>
                        <a
                          href={file.content.Location}
                          alt={file.content.filename}
                          _id={file._id}
                        >
                          <i className='far fa-file-alt'></i>
                          <figcaption>{file.content.filename}</figcaption>
                        </a>
                        <i
                          className='file-options fas fa-copy'
                          onClick={(e) => copyFileUrl(index)}
                        ></i>
                        <i
                          className='file-options fas fa-trash'
                          onClick={(e) => deleteFile(index)}
                        ></i>
                      </div>
                    );
                  })}
                </div>
              }
            </Paper>
          </Container>
          <Snackbar
            className={classes.snackbar}
            open={snackbarState.open}
            ContentProps={{
              classes: {
                root: classes.snackbar, //in this css class set the maxWidth
              },
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleCloseSnackbar}
            TransitionComponent={snackbarState.Transition}
            message={snackbarMsg}
          />
        </div>
      </Paper>
    </ThemeProvider>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ClipboardPage));
