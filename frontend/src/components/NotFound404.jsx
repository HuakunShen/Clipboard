import React from 'react';
import '../stylesheets/NotFound404.scss';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
  return (
    <div className="not-found-404-page">
      <div>
        <h1 data-h1="404">404</h1>
        <p data-p="PAGE NOT FOUND">PAGE NOT FOUND</p>
        <Link to="/">
          <button class="btn">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound404;
