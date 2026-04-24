import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
};

const SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('vv_currency') || 'INR');

  useEffect(() => {
    localStorage.setItem('vv_currency', currency);
  }, [currency]);

  const formatPrice = (priceInINR) => {
    const converted = priceInINR * RATES[currency];
    return `${SYMBOLS[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbols: SYMBOLS }}>
      {children}
    </CurrencyContext.Provider>
  );
};
