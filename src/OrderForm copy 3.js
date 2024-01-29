import React, { useState } from 'react';
import { useClient } from './ClientContext';
import './OrderForm.css';


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
    const [submissionStatus, setSubmissionStatus] = useState({
        Motorcycle: false,
        Car: false,
        Truck: false,
        Trailer: false
    });
    

    

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
        // Check if all fields are filled for the respective product type
        let productFieldsFilled = false;
        switch (productType) {
            case 'Motorcycle':
                productFieldsFilled = motorcycle.brand && motorcycle.model && motorcycle.engineCapacity && motorcycle.colour;
                break;
            case 'Car':
                productFieldsFilled = car.brand && car.model && car.engineCapacity && car.colour && car.numberOfDoors && car.category;
                break;
            case 'Truck':
                productFieldsFilled = truck.brand && truck.model && truck.engineCapacity && truck.colour && truck.numberOfBeds;
                break;
            case 'Trailer':
                productFieldsFilled = trailer.brand && trailer.model && trailer.loadCapacity && trailer.numberOfAxles;
                break;
            default:
                break;
        }
    
        if (!productFieldsFilled) {
            // Update submission status to show validation errors
            setSubmissionStatus(prevStatus => ({ ...prevStatus, [productType]: true }));
            return; // Prevent adding if any required field is empty
        }
    
        // If all fields are filled, proceed to add the product
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
                setTruck({ brand: '', model: '', engineCapacity: '', colour: '', numberOfBeds: '' });
                break;
            case 'Trailer':
                setProducts([...products, { ...trailer, type: 'Trailer', numberOfAxles: parseInt(trailer.numberOfAxles) }]);
                setTrailer({ brand: '', model: '', loadCapacity: '', numberOfAxles: '' });
                break;
            default:
                break;
        }
    
        // Reset submission status
        setSubmissionStatus(prevStatus => ({ ...prevStatus, [productType]: false }));
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
        
        <div className="main-content">
        <div className="form-container">
            <h1>Order Form</h1>
            <form onSubmit={handleSubmit} className="container mt-5">
            <div className="mb-3">
                <label htmlFor="productType" className="form-label">Choose a Product Type:</label>
                <select id="productType" value={productType} onChange={handleProductTypeChange} className="form-select">
                    <option value="">Select Type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Car">Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Trailer">Trailer</option>
                </select>
            </div>
            {productType === 'Motorcycle' && (
                <div>
                    {/* Brand Field */}
                    <div className="mb-3">
                        <label htmlFor="brand" className="form-label">Brand:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Motorcycle && !motorcycle.brand ? 'is-invalid' : ''}`}
                            name="brand"
                            id="brand"
                            value={motorcycle.brand}
                            onChange={handleMotorcycleChange}
                        />
                        {submissionStatus.Motorcycle && !motorcycle.brand && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Model Field */}
                    <div className="mb-3">
                        <label className="form-label">Model:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Motorcycle && !motorcycle.model ? 'is-invalid' : ''}`}
                            name="model"
                            value={motorcycle.model}
                            onChange={handleMotorcycleChange}
                        />
                        {submissionStatus.Motorcycle && !motorcycle.model && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Engine Capacity Field */}
                    <div className="mb-3">
                        <label className="form-label">Engine Capacity:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Motorcycle && !motorcycle.engineCapacity ? 'is-invalid' : ''}`}
                            name="engineCapacity"
                            value={motorcycle.engineCapacity}
                            onChange={handleMotorcycleChange}
                        />
                        {submissionStatus.Motorcycle && !motorcycle.engineCapacity && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Colour Field */}
                    <div className="mb-3">
                        <label className="form-label">Colour:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Motorcycle && !motorcycle.colour ? 'is-invalid' : ''}`}
                            name="colour"
                            value={motorcycle.colour}
                            onChange={handleMotorcycleChange}
                        />
                        {submissionStatus.Motorcycle && !motorcycle.colour && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary mb-3"
                        onClick={() => addProduct('Motorcycle')}
                    >
                        Add Motorcycle
                    </button>
                </div>
            )}
            {productType === 'Car' && (
                <div>
                    {/* Brand Field */}
                    <div className="mb-3">
                        <label htmlFor="carBrand" className="form-label">Brand:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Car && !car.brand ? 'is-invalid' : ''}`}
                            name="brand"
                            id="carBrand"
                            value={car.brand}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.brand && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Model Field */}
                    <div className="mb-3">
                        <label htmlFor="carModel" className="form-label">Model:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Car && !car.model ? 'is-invalid' : ''}`}
                            name="model"
                            id="carModel"
                            value={car.model}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.model && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Engine Capacity Field */}
                    <div className="mb-3">
                        <label htmlFor="carEngineCapacity" className="form-label">Engine Capacity:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Car && !car.engineCapacity ? 'is-invalid' : ''}`}
                            name="engineCapacity"
                            id="carEngineCapacity"
                            value={car.engineCapacity}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.engineCapacity && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Colour Field */}
                    <div className="mb-3">
                        <label htmlFor="carColour" className="form-label">Colour:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Car && !car.colour ? 'is-invalid' : ''}`}
                            name="colour"
                            id="carColour"
                            value={car.colour}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.colour && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Number of Doors Field */}
                    <div className="mb-3">
                        <label htmlFor="carNumberOfDoors" className="form-label">Number of Doors:</label>
                        <input
                            type="number"
                            className={`form-control ${submissionStatus.Car && !car.numberOfDoors ? 'is-invalid' : ''}`}
                            name="numberOfDoors"
                            id="carNumberOfDoors"
                            value={car.numberOfDoors}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.numberOfDoors && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Car Category Field */}
                    <div className="mb-3">
                        <label htmlFor="carCategory" className="form-label">Car Category:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Car && !car.category ? 'is-invalid' : ''}`}
                            name="category"
                            id="carCategory"
                            value={car.category}
                            onChange={handleCarChange}
                        />
                        {submissionStatus.Car && !car.category && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary mb-3"
                        onClick={() => addProduct('Car')}
                    >
                        Add Car
                    </button>
                </div>
            )}


            {productType === 'Truck' && (
                <div>
                    {/* Brand Field */}
                    <div className="mb-3">
                        <label htmlFor="truckBrand" className="form-label">Brand:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Truck && !truck.brand ? 'is-invalid' : ''}`}
                            name="brand"
                            id="truckBrand"
                            value={truck.brand}
                            onChange={handleTruckChange}
                        />
                        {submissionStatus.Truck && !truck.brand && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Model Field */}
                    <div className="mb-3">
                        <label htmlFor="truckModel" className="form-label">Model:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Truck && !truck.model ? 'is-invalid' : ''}`}
                            name="model"
                            id="truckModel"
                            value={truck.model}
                            onChange={handleTruckChange}
                        />
                        {submissionStatus.Truck && !truck.model && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Engine Capacity Field */}
                    <div className="mb-3">
                        <label htmlFor="truckEngineCapacity" className="form-label">Engine Capacity:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Truck && !truck.engineCapacity ? 'is-invalid' : ''}`}
                            name="engineCapacity"
                            id="truckEngineCapacity"
                            value={truck.engineCapacity}
                            onChange={handleTruckChange}
                        />
                        {submissionStatus.Truck && !truck.engineCapacity && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Colour Field */}
                    <div className="mb-3">
                        <label htmlFor="truckColour" className="form-label">Colour:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Truck && !truck.colour ? 'is-invalid' : ''}`}
                            name="colour"
                            id="truckColour"
                            value={truck.colour}
                            onChange={handleTruckChange}
                        />
                        {submissionStatus.Truck && !truck.colour && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Number of Beds Field */}
                    <div className="mb-3">
                        <label htmlFor="truckNumberOfBeds" className="form-label">Number of Beds:</label>
                        <input
                            type="number"
                            className={`form-control ${submissionStatus.Truck && !truck.numberOfBeds ? 'is-invalid' : ''}`}
                            name="numberOfBeds"
                            id="truckNumberOfBeds"
                            value={truck.numberOfBeds}
                            onChange={handleTruckChange}
                        />
                        {submissionStatus.Truck && !truck.numberOfBeds && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary mb-3"
                        onClick={() => addProduct('Truck')}
                    >
                        Add Truck
                    </button>
                </div>
            )}


            {productType === 'Trailer' && (
                <div>
                    {/* Brand Field */}
                    <div className="mb-3">
                        <label htmlFor="trailerBrand" className="form-label">Brand:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Trailer && !trailer.brand ? 'is-invalid' : ''}`}
                            name="brand"
                            id="trailerBrand"
                            value={trailer.brand}
                            onChange={handleTrailerChange}
                        />
                        {submissionStatus.Trailer && !trailer.brand && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Model Field */}
                    <div className="mb-3">
                        <label htmlFor="trailerModel" className="form-label">Model:</label>
                        <input
                            type="text"
                            className={`form-control ${submissionStatus.Trailer && !trailer.model ? 'is-invalid' : ''}`}
                            name="model"
                            id="trailerModel"
                            value={trailer.model}
                            onChange={handleTrailerChange}
                        />
                        {submissionStatus.Trailer && !trailer.model && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Load Capacity Field */}
                    <div className="mb-3">
                        <label htmlFor="trailerLoadCapacity" className="form-label">Load Capacity:</label>
                        <input
                            type="number"
                            className={`form-control ${submissionStatus.Trailer && !trailer.loadCapacity ? 'is-invalid' : ''}`}
                            name="loadCapacity"
                            id="trailerLoadCapacity"
                            value={trailer.loadCapacity}
                            onChange={handleTrailerChange}
                        />
                        {submissionStatus.Trailer && !trailer.loadCapacity && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    {/* Number of Axles Field */}
                    <div className="mb-3">
                        <label htmlFor="trailerNumberOfAxles" className="form-label">Number of Axles:</label>
                        <input
                            type="number"
                            className={`form-control ${submissionStatus.Trailer && !trailer.numberOfAxles ? 'is-invalid' : ''}`}
                            name="numberOfAxles"
                            id="trailerNumberOfAxles"
                            value={trailer.numberOfAxles}
                            onChange={handleTrailerChange}
                        />
                        {submissionStatus.Trailer && !trailer.numberOfAxles && (
                            <div className="invalid-feedback">
                                Please fill this field.
                            </div>
                        )}
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary mb-3"
                        onClick={() => addProduct('Trailer')}
                    >
                        Add Trailer
                    </button>
                </div>
            )}

               
               <button type="submit" disabled={isSubmitDisabled}>Submit Order</button>
        </form>
        </div>
        </div>
    );
};

export default OrderForm;
