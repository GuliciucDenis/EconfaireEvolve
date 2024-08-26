import React from 'react';
import { Input } from '@nextui-org/react';
import './Searchbar.css';

function Searchbar({ onSearch }) {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <Input
      type="search"
      placeholder="Search FAQs..."
      onChange={handleSearch}
    />
  );
}

export default Searchbar;