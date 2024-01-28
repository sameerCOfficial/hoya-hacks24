import React, { createContext, useContext, useState } from 'react';

const BotResponseContext = createContext();

export const BotResponseProvider = ({ children }) => {
  const [botResponses, setBotResponses] = useState([]);

  const addBotResponse = (response) => {
    setBotResponses((prevResponses) => [...prevResponses, response]);
  };

  return (
    <BotResponseContext.Provider value={{ botResponses, addBotResponse }}>
      {children}
    </BotResponseContext.Provider>
  );
};

export const useBotResponse = () => {
  return useContext(BotResponseContext);
};