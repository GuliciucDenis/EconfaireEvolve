import React, { useState } from 'react';
import Searchbar from '../../components/common/searchbar/Searchbar';
import Navbar from '../../components/common/navbar/Navbar';
import Background from '../../components/background/Background';
import FAQCard from '../../components/common/faqcard/faqcard';
import User from '../../components/common/user/User';
import './FAQs.css';
import LanguageSelector from '../../components/language-selector';
import { useTranslation } from 'react-i18next';

function FAQs() {
    const [searchTerm, setSearchTerm] = useState('');
    const {t}=useTranslation();

    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    const faqList = [
        {
            question: t('faqs.question1'),
            answer: t('faqs.answer1')
        },
        {
            question: t('faqs.question2'),
            answer: t('faqs.answer2')
        },
        {
            question: t('faqs.question3'),
            answer: t('faqs.answer3')
        },
        {
            question: t('faqs.question4'),
            answer: t('faqs.answer4')
        },
        {
            question: t('faqs.question5'),
            answer: t('faqs.answer5')
        },
        {
            question: t('faqs.question6'),
            answer: t('faqs.answer6')
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
            <LanguageSelector />
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