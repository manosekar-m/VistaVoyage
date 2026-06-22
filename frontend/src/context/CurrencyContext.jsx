import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('vv_currency') || 'INR');

  const changeCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem('vv_currency', code);
  };

  const convertPrice = (priceInINR) => {
    switch (currency) {
      case 'USD': return Math.round(priceInINR / 83);
      case 'EUR': return Math.round(priceInINR / 90);
      default: return priceInINR;
    }
  };

  const formatPrice = (priceInINR) => {
    const val = convertPrice(priceInINR);
    switch (currency) {
      case 'USD': return `$${val}`;
      case 'EUR': return `€${val}`;
      default: return `₹${val}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
