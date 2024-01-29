import React, { createContext, useState, useEffect, useContext } from 'react';

const ClientContext = createContext();

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
    const [clientName, setClientName] = useState('');

    useEffect(() => {
        // Load client name from localStorage when the component mounts
        const storedName = localStorage.getItem('clientName');
        if (storedName) {
            setClientName(storedName);
        }
    }, []);

    const updateClientName = (name, familyName) => {
        const formattedName = `${capitalize(name)} ${capitalize(familyName)}`;
        setClientName(formattedName);
        localStorage.setItem('clientName', formattedName); // Save to localStorage
    };

    const logout = () => {
        setClientName(''); // Reset the client name in state
        localStorage.removeItem('clientName'); // Clear client name from localStorage
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    return (
        <ClientContext.Provider value={{ clientName, updateClientName, logout }}>
            {children}
        </ClientContext.Provider>
    );
};
