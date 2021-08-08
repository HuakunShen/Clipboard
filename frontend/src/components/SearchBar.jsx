import React from 'react';
import '../stylesheets/SearchBar.scss';

const SearchBar = (props) => {
  const { id, input_id, search_btn_id, searchBtnClicked } = props;
  return (
    <div id={`${id ? id : ''}`} className="search-bar-component">
      <div className="search-box">
        <input
          type="text"
          id={`${input_id ? input_id : ''}`}
          name="search"
          className="search-txt"
          placeholder="search..."
        />
        <div
          id={`${search_btn_id ? search_btn_id : ''}`}
          onClick={searchBtnClicked ? searchBtnClicked : () => {}}
          className="search-btn"
        >
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
