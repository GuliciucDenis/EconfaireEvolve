import React from 'react';
import { Input } from '@nextui-org/react';
import './Searchbar.css';
import { useTranslation } from 'react-i18next';

function Searchbar({ onSearch }) {
  const {t}=useTranslation();
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-container">
    <Input
      type="search"
      placeholder={t('searchbar.searchFAQs')}
      onChange={handleSearch}
    />
    </div>
  );
}

export default Searchbar;