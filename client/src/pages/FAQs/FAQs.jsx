import React from 'react';
import Searchbar from '../../components/common/searchbar/Searchbar';
import './FAQs.css';

function FAQs() {
    const handleSearch = (searchTerm) => {
      console.log('Searching for:', searchTerm);
    };
  
    return (
    <div className="faqs-container">
        <div>
            <p className="faqs-title">FAQs</p>
        </div>
        <div className="searchbar-container">
            <Searchbar onSearch={handleSearch} />
        </div>
    </div>
    );
  }

export default FAQs;