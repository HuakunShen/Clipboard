import React, { useEffect } from 'react';
import $ from 'jquery';
import '../stylesheets/SearchBarTransform.scss';

const SearchBarTransform = () => {
  // component did mount
  useEffect(() => {
    $('.btn').on('click', function () {
      $('.input').toggleClass('inclicked');
      $('.btn').toggleClass('close');
    });
  }, []);
  return (
    <div className='search-bar-transform-component'>
      <div className='middle'>
        <form className='search-box' action='index.html' method='post'>
          <input type='text' className='input' name='' value='' />
          <button type='button' className='btn' name='button'></button>
        </form>
      </div>
    </div>
  );
};

export default SearchBarTransform;
