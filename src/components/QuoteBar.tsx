import React from "react";
import { getQuoteOfTheDay } from "../lib/quoteOfTheDay";

const QuoteBar: React.FC = () => {
  const quote = getQuoteOfTheDay();

  return (
    <div className="quote-bar">
      <span className="quote-icon">✨</span>
      <p className="quote-text">{quote}</p>
    </div>
  );
};

export default QuoteBar;
