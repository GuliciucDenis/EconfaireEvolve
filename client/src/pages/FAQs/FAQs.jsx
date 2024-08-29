import React, { useState } from 'react';
import Searchbar from '../../components/common/searchbar/Searchbar';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import FAQCard from '../../components/common/faqcard/faqcard';
import User from '../../components/common/user/User';
import './FAQs.css';

function FAQs() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    const faqList = [
        {
            question: "What is Econfaire eVolve™?",
            answer: "Econfaire eVolve™ is an application that helps Econfaire employees develop their skills."
        },
        {
            question: "How do I create an account?",
            answer: "To create an account, contact an Admin."
        },
        {
            question: "Is Econfaire eVolve™ free?",
            answer: "Yes! Econfaire eVolve™ offers both basic and advanced features for free."
        },
        {
            question: "Is there a mobile app available?",
            answer: "Not at the moment, but Econfaire eVolve™ promises mobile apps for iOS and Android, allowing you to manage your goals on the go."
        },
        {
            question: "How can I contact technical support?",
            answer: "You can contact one of the Admins. However, we encourage you to check the FAQs page before contacting an Admin. Time is precious! :)"
        },
        {
            question: "Who created Econfaire eVolve™?",
            answer: "Econfaire eVolve™ was created by Bold Iustina, Burca Flavian, Brebenel Leonard-Cristian, Guliciuc Denis, Hertanu Razvan and Postolache Stefan-Darius."
        },
    ];

    const sortedFAQs = faqList.sort((a, b) => {
        const aMatch = a.question.toLowerCase().includes(searchTerm) || a.answer.toLowerCase().includes(searchTerm);
        const bMatch = b.question.toLowerCase().includes(searchTerm) || b.answer.toLowerCase().includes(searchTerm);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });
  
    return (
        <div className="faqs-page">
            <Background />
            <User />
            <div className="content">
                <Navbar />
                <div className="faqs-container">
                    <div className="searchbar-container">
                        <Searchbar onSearch={handleSearch} />
                    </div>
                    <div className="faq-cards-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)'}}>
                        {sortedFAQs.map((faq, index) => (
                            <FAQCard key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQs;