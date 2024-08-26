import React from 'react';
import Searchbar from '../../components/common/searchbar/Searchbar';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import FAQCard from '../../components/common/faqcard/faqcard';
import './FAQs.css';

function FAQs() {
    const handleSearch = (searchTerm) => {
        console.log('Searching for:', searchTerm);
    };
  
    return (
        <div className="faqs-page">
            <Background />
            <div className="content">
                <Navbar />
                <div className="faqs-container">
                    <div className="searchbar-container">
                        <Searchbar onSearch={handleSearch} />
                    </div>
                    <div className="faq-cards-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)'}}>
                        <FAQCard question="What is Econfaire Evolve?" answer="Econfaire Evolve is a platform that allows you to create and manage your own events." />
                        <FAQCard question="How do I create an event?" answer="To create an event, log in to your account and click on the 'Create Event' button. Follow the prompts to enter event details." />
                        <FAQCard question="Is Econfaire Evolve free to use?" answer="Econfaire Evolve offers both free and premium plans. The basic features are free, while advanced features may require a subscription." />
                        <FAQCard question="Can I customize my event page? E o intrebare mai lunga ca sa testez daca isi da bine resize xoxo" answer="Yes, Econfaire Evolve provides various customization options for your event page, including themes, colors, and layout choices." />
                        <FAQCard question="How do I manage ticket sales?" answer="Econfaire Evolve has built-in ticket management features. You can set up different ticket types, prices, and track sales through your event dashboard. Econfaire Evolve has built-in ticket management features. You can set up different ticket types, prices, and track sales through your event dashboard." />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQs;