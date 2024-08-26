import React from "react";
import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react";
import "./faqcard.css";

const FAQCard = ({ question, answer }) => {
  return (
    <Card className="faq-card">
      <CardHeader>
        <div>
          <p className="faq-card-title">{question}</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p className="faq-card-description">{answer}</p>
      </CardBody>
    </Card>
  );
}

export default FAQCard;