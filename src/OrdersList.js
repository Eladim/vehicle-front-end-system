import React, { useState, useEffect } from 'react';
import { useClient } from './ClientContext';
import './OrderList.css';


const OrdersList = () => {
    const { clientName } = useClient();
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/orders/client?name=${encodeURIComponent(clientName)}`)
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error:', error));
    }, [clientName]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const fetchProductDetails = async (productId) => {
        if (expandedProductId === productId) {
            setExpandedProductId(null);
            setProductDetails(null);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProductDetails(data);
            setExpandedProductId(productId);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className="orders-container">
            <h1 className="orders-header">Orders for {clientName}</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                            <h2>Order {order.orderNumber}</h2>
                            <p>{formatDate(order.dateCreated)}</p>
                            </div>
                            {expandedOrderId === order.id && (
                                <ul className="order-details">
                                {order.orderDetails.map(detail => (
                                    <li key={detail.productId} className="product-item" onClick={() => fetchProductDetails(detail.productId)}>
                                        {detail.productType}{/* - ID: {detail.productId}*/}
                                        {expandedProductId === detail.productId && productDetails && (
                                            <div className="product-details">
                                                <p>Brand: {productDetails.brand}</p>
                                                <p>Model: {productDetails.model}</p>
                                                {productDetails.engineCapacity && <p>Engine Capacity: {productDetails.engineCapacity}</p>}
                                                {productDetails.colour && <p>Colour: {productDetails.colour}</p>}
                                                {productDetails.numberOfDoors && <p>Number of Doors: {productDetails.numberOfDoors}</p>}
                                                {productDetails.category && <p>Category: {productDetails.category}</p>}
                                                {productDetails.numberOfBeds && <p>Number of Beds: {productDetails.numberOfBeds}</p>}
                                                {productDetails.loadCapacity && <p>Load Capacity: {productDetails.loadCapacity}</p>}
                                                {productDetails.numberOfAxles && <p>Number of Axles: {productDetails.numberOfAxles}</p>}
                                                {/* Include other product fields as needed */}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersList;
