import React, { useState, useEffect, useRef } from 'react';
import '../../stylesheets/DragNdrop.scss';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  uploadIcon: {
    // pointerEvents: 'none',
  },
  onDragOver: {
    color: '#4cd137',
  },
}));
const DragNdrop = (props) => {
  const { transferData } = props;
  const inputRef = useRef();
  const classes = useStyles();
  const [uploadIconClass, setUploadIconClass] = useState('');
  useEffect(() => {}, []);
  const handleDragOver = (e) => {
    e.preventDefault();
    console.log('over');
    setUploadIconClass(classes.onDragOver);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setUploadIconClass('');
    transferData(files);
  };
  const handleClickInput = (e) => {
    const files = Array.from(e.target.files);
    transferData(files);
  };
  const handleDragLeave = (e) => {
    console.log('leave');
    setUploadIconClass('');
  };
  return (
    <div className="drag-n-drop-component">
      <div
        className="drop-region"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={(e) => {
          console.log('clicked');
          inputRef.current.click();
        }}
      >
        <CloudUploadIcon
          className={`${classes.uploadIcon} ${uploadIconClass}`}
          style={{ fontSize: 100, pointerEvents: 'none' }}
        />
      </div>
      <input onChange={handleClickInput} ref={inputRef} type="file" multiple />
    </div>
  );
};

export default DragNdrop;
