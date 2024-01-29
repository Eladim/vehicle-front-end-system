import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import OrderForm from './OrderForm';
import OrdersList from './OrdersList';
import Home from './Home'; // Import the Home component
import Style from './StyleTest.js';
import { ClientProvider } from './ClientContext';

function App() {
    return (
        <ClientProvider>
            <Router>
                <div className="App">
                    <nav>
                        <Link to="/">Home</Link> | 
                        <Link to="/create-order">Create Order</Link> |
                        <Link to="/orders">View Orders</Link> | 
                        <Link to="/style-test">Style Test</Link>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Home />} /> {/* Updated this line */}
                        <Route path="/create-order" element={<OrderForm />} />
                        <Route path="/orders" element={<OrdersList />} />
                        <Route path="/style-test" element={<Style />} />

                    </Routes>
                </div>
            </Router>
        </ClientProvider>
    );
}

export default App;
