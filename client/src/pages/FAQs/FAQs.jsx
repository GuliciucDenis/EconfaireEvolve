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
            question: "Ce este Econfaire eVolve™?",
            answer: "Econfaire eVolve™ este o aplicație care ajută angajații Econfaire să își dezvolte abilitățile."
        },
        {
            question: "Cum îmi creez un cont?",
            answer: "Pentru a crea un cont, contactați un Admin."
        },
        {
            question: "Econfaire eVolve™ este gratuit?",
            answer: "Da! Econfaire eVolve™ oferă atât funcții de bază cât și funcții avansate in mod gratuit."
        },
        {
            question: "Există o aplicație mobilă disponibilă?",
            answer: "Momentan nu, dar Econfaire eVolve™ promite aplicații mobile pentru iOS și Android, permițându-vă să vă gestionați obiectivele din mers."
        },
        {
            question: "Cum pot contacta asistența tehnică?",
            answer: "Puteți contacta unul dintre Admini. Totuși, incurajăm căutarea soluției in pagina de FAQs inainte de a contacta un Admin. Timpul este prețios! :)"
        },
        {
            question: "Cine a creat Econfaire eVolve™?",
            answer: "Econfaire eVolve™ a fost creat de catre ..."
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