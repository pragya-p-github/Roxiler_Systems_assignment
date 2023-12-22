import React from 'react';

const SearchBar = ({ searchText, setSearchText, handleSearch, handleClearSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClearSearch}>Clear Search</button>
    </div>
  );
};

export default SearchBar;
