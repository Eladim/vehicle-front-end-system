import React, { useState, useEffect } from 'react';
import { useClient } from './ClientContext';
import './Home.css'; // Import your CSS file

const Home = () => {
    const { clientName, updateClientName, logout } = useClient();
    const [name, setName] = useState('');
    const [familyName, setFamilyName] = useState('');

    useEffect(() => {
        if (clientName) {
            const [firstName, lastName] = clientName.split(' ');
            setName(firstName || '');
            setFamilyName(lastName || '');
        }
    }, [clientName]);


    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        // Ensure both name and familyName are strings
        const firstName = name || '';
        const lastName = familyName || '';
        updateClientName(firstName, lastName);
    };
    const handleLogout = () => {
        logout();
        setName('');
        setFamilyName('');
    };
    
    return (
        <div className="home-container">
            {clientName ? (
                <div>
                    <p>Logged in as: {clientName}</p>
                    <button onClick={handleLogout} className="home-button logout-button">Log Out</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="home-form">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="home-input" 
                    />
                    <input 
                        type="text" 
                        placeholder="Family Name" 
                        value={familyName} 
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="home-input"
                    />
                    <button type="submit" className="home-button submit-button">Submit</button>
                </form>
            )}
        </div>
    );
};

export default Home;
