import React, { useState, createContext, useContext } from 'react';

const CustomDragDropContext = createContext();

export const CustomDragDropProvider = ({ children }) => {
  const [draggedRecipient, setDraggedRecipient] = useState(null);
  const [draggedData, setDraggedData] = useState([]);

  const handleDragRecipient = (recipient) => {
    // console.log("recipient in handelDragRecipient= ",recipient)
    // setDraggedRecipient(recipient);
    setDraggedRecipient(Array.isArray(recipient) ? recipient : [recipient]);
  };

  const handleDropRecipient = () => {
    console.log("draggedRecipient in handleDropRecipient",draggedRecipient)
    setDraggedRecipient(null);
  };

  const resetDraggedData = () => {
    setDraggedData([]);
  };

  return (
    <CustomDragDropContext.Provider value={{ draggedRecipient, draggedData, setDraggedData, handleDragRecipient, handleDropRecipient, resetDraggedData }}>
      {children}
    </CustomDragDropContext.Provider>
  );
};

export const useDragDropContext = () => {
  return useContext(CustomDragDropContext);
};
