import React, { useEffect } from 'react';
import '../stylesheets/Loader.scss';
import $ from 'jquery';
const Loader = () => {
  useEffect(() => {
    $('.loader-container').fadeOut(1000);
  }, []);

  return (
    <div className='loader-container'>
      <div className='loader'></div>
    </div>
  );
};

export default Loader;
