import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';



const PreviewOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    


    
    const products = location.state.products; // Extract products from the passed state
    
    const handleEdit = (productId) => {
        // Logic to handle edit
        // This could involve setting a state with the product's details and showing a form/modal for editing
    };

    const submitOrder = () => {
        // Submit the final order logic
        // After submitting, navigate to a confirmation page or back to the order form
        navigate('/order-confirmation'); // Replace with your actual route for order confirmation
    };

    return (
        <div>
            <h1>Preview Your Order</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {products.map((product, index) => (
                    <div key={index} style={{ border: '1px solid black', padding: '10px', width: '200px' }}>
                        <div><strong>Type:</strong> {product.type}</div>
                        <div><strong>Brand:</strong> {product.brand}</div>
                        <div><strong>Model:</strong> {product.model}</div>
                        {/* Add other product details here */}
                        <button onClick={() => handleEdit(product.id)} style={{ marginTop: '10px' }}>Edit</button>
                    </div>
                ))}
            </div>
            <button onClick={submitOrder} style={{ marginTop: '20px' }}>Submit Final Order</button>
        </div>
    );
};

export default PreviewOrder;
