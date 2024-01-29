import React, { useState } from 'react';
import { useClient } from './ClientContext';

const OrderForm = () => {
    const { clientName, updateClientName, logout } = useClient(); // Add clientName state
    const [products, setProducts] = useState([]); // <-- New state to store all products
    const [productType, setProductType] = useState('');
    const [motorcycle, setMotorcycle] = useState({
        brand: '',
        model: '',
        engineCapacity: '',
        colour: ''
    });
    const [car, setCar] = useState({
        brand: '',
        model: '',
        engineCapacity: '',
        colour: '',
        numberOfDoors: '',
        category: ''
    });

    const [truck, setTruck] = useState({
        brand: '',
        model: '',
        engineCapacity: '',
        colour: '',
        numberOfBeds: ''
    });
    const [trailer, setTrailer] = useState({
        brand: '',
        model: '',
        loadCapacity: '',
        numberOfAxles: ''
    });
    const isSubmitDisabled = products.length === 0 || !clientName;
    

    const handleProductTypeChange = (event) => {
        setProductType(event.target.value);
    };

    const handleMotorcycleChange = (e) => {
        setMotorcycle({
            ...motorcycle,
            [e.target.name]: e.target.value
        });
    };
    const handleCarChange = (e) => {
        setCar({
            ...car,
            [e.target.name]: e.target.value
        });
    };
    const handleTruckChange = (e) => {
        setTruck({ ...truck, [e.target.name]: e.target.value });
    };

    // Handle change for trailer fields
    const handleTrailerChange = (e) => {
        setTrailer({ ...trailer, [e.target.name]: e.target.value });
    };

    const addProduct = (productType) => {
        switch (productType) {
            case 'Motorcycle':
                setProducts([...products, { ...motorcycle, type: 'Motorcycle' }]);
                setMotorcycle({ brand: '', model: '', engineCapacity: '', colour: '' });
                break;
            case 'Car':
                setProducts([...products, { ...car, type: 'Car' }]);
                setCar({ brand: '', model: '', engineCapacity: '', colour: '', numberOfDoors: '', category: '' });
                break;
            case 'Truck':
                setProducts([...products, { ...truck, type: 'Truck', numberOfBeds: parseInt(truck.numberOfBeds) }]);
                setTruck({ brand: '', model: '', engineCapacity: '', colour: '', numberOfBeds: ''});
                break;
            case 'Trailer':
                setProducts([...products, { ...trailer, type: 'Trailer', numberOfAxles: parseInt(trailer.numberOfAxles) }]);
                setTrailer({ brand: '', model: '', loadCapacity: '', numberOfAxles: ''});
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare product submissions
        const productSubmissions = products.map(product => {
            return fetch(`http://localhost:8000/api/submit-${product.type.toLowerCase()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            })
            .then(response => response.json())
            .then(data => ({ id: data.id, type: product.type })) // Include product type in the response
            .catch(error => console.error('Error submitting product:', error));
        });
    
        // Wait for all products to be submitted
        const submittedProducts = await Promise.all(productSubmissions);
    
        // Now, prepare and submit the order
        const orderDetails = submittedProducts.map(product => ({
            productId: product.id,
            productType: product.type, // Include productType in orderDetails
        }));
    
        // Example order data structure
        const orderData = {
            clientName: clientName, // Replace with actual client name from context
            orderDetails: orderDetails,
        };
    
        // Submit the order
        fetch('http://localhost:8000/api/submit-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Order submitted successfully:', data);
            // Clear the products list and other states as needed
            setProducts([]);
            // Handle other success actions...
        })
        .catch(error => {
            console.error('Error submitting order:', error);
        });
    };


    return (
        
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="productType">Choose a Product Type:</label>
                <select id="productType" value={productType} onChange={handleProductTypeChange}>
                    <option value="">Select Type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Trailer">Trailer</option>
                </select>
            </div>

            {productType === 'Motorcycle' && (
                <>
                    <div>
                        <label>Brand:</label>
                        <input
                            type="text"
                            name="brand"
                            value={motorcycle.brand}
                            onChange={handleMotorcycleChange}
                        />
                    </div>
                    <div>
                        <label>Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={motorcycle.model}
                            onChange={handleMotorcycleChange}
                        />
                    </div>
                    <div>
                        <label>Engine Capacity:</label>
                        <input
                            type="text"
                            name="engineCapacity"
                            value={motorcycle.engineCapacity}
                            onChange={handleMotorcycleChange}
                        />
                    </div>
                    <div>
                        <label>Colour:</label>
                        <input
                            type="text"
                            name="colour"
                            value={motorcycle.colour}
                            onChange={handleMotorcycleChange}
                        />
                    </div>
                    <div>
                    <button 
                        type="button" 
                        onClick={() => addProduct('Motorcycle')}
                        disabled={!motorcycle.brand || !motorcycle.model || !motorcycle.engineCapacity || !motorcycle.colour}
                    >
                        Add Motorcycle
                    </button>

                    </div>
                </>
            )}

            {productType === 'Car' && (
                <>
                    <div>
                        <label>Brand:</label>
                        <input
                            type="text"
                            name="brand"
                            value={car.brand}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                        <label>Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={car.model}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                        <label>Engine Capacity:</label>
                        <input
                            type="text"
                            name="engineCapacity"
                            value={car.engineCapacity}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                        <label>Colour:</label>
                        <input
                            type="text"
                            name="colour"
                            value={car.colour}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                        <label>Number of Doors:</label>
                        <input
                            type="number"
                            name="numberOfDoors"
                            value={car.numberOfDoors}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                        <label>Car Category:</label>
                        <input
                            type="text"
                            name="category"
                            value={car.category}
                            onChange={handleCarChange}
                        />
                    </div>
                    <div>
                    <button 
                        type="button" 
                        onClick={() => addProduct('Car')}
                        disabled={!car.brand || !car.model || !car.engineCapacity || !car.colour || !car.numberOfDoors || !car.category}
                    >
                        Add Car
                    </button>

                    </div>
                </>
            )}

            {productType === 'Truck' && (
                <>
                    <div>
                        <label>Brand:</label>
                        <input type="text" name="brand" value={truck.brand} onChange={handleTruckChange} />
                    </div>
                    <div>
                        <label>Model:</label>
                        <input type="text" name="model" value={truck.model} onChange={handleTruckChange} />
                    </div>
                    <div>
                        <label>Engine Capacity:</label>
                        <input type="text" name="engineCapacity" value={truck.engineCapacity} onChange={handleTruckChange} />
                    </div>
                    <div>
                        <label>Colour:</label>
                        <input type="text" name="colour" value={truck.colour} onChange={handleTruckChange} />
                    </div>
                    <div>
                        <label>Number of Beds:</label>
                        <input type="number" name="numberOfBeds" value={truck.numberOfBeds} onChange={handleTruckChange} />
                    </div>
                    <div>
                    <button 
                        type="button" 
                        onClick={() => addProduct('Truck')}
                        disabled={!truck.brand || !truck.model || !truck.engineCapacity || !truck.colour || !truck.numberOfBeds}
                    >
                        Add Truck
                    </button>

                    </div>
                </>
            )}

            {productType === 'Trailer' && (
                <>
                    <div>
                        <label>Brand:</label>
                        <input type="text" name="brand" value={trailer.brand} onChange={handleTrailerChange} />
                    </div>
                    <div>
                        <label>Model:</label>
                        <input type="text" name="model" value={trailer.model} onChange={handleTrailerChange} />
                    </div>
                    <div>
                        <label>Load Capacity:</label>
                        <input type="number" name="loadCapacity" value={trailer.loadCapacity} onChange={handleTrailerChange} />
                    </div>
                    <div>
                        <label>Number of Axles:</label>
                        <input type="number" name="numberOfAxles" value={trailer.numberOfAxles} onChange={handleTrailerChange} />
                    </div>
                    <div>
                    <button 
                        type="button" 
                        onClick={() => addProduct('Trailer')}
                        disabled={!trailer.brand || !trailer.model || !trailer.loadCapacity || !trailer.numberOfAxles}
                    >
                        Add Trailer
                    </button>

                    </div>
                </>
            )}
               
               <button type="submit" disabled={isSubmitDisabled}>Submit Order</button>
        </form>
    );
};

export default OrderForm;
