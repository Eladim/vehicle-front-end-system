import React, { useState } from 'react';


const OrderForm = () => {
    
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input data
        if (!motorcycle.brand || !motorcycle.model || !motorcycle.engineCapacity || !motorcycle.colour) {
            console.error('Please fill in all fields');
            return; // Stop the function if validation fails
        }

        let apiEndpoint;
        let submissionData;
        switch (productType) {
            case 'Motorcycle':
                apiEndpoint = 'http://localhost:8000/api/submit-motorcycle';
                submissionData = motorcycle;
                break;
            case 'Car':
                apiEndpoint = 'http://localhost:8000/api/submit-car';
                submissionData = car;
                break;
            case 'Truck':
                apiEndpoint = 'http://localhost:8000/api/submit-truck';
                submissionData = truck;
                break;
            case 'Trailer':
                apiEndpoint = 'http://localhost:8000/api/submit-trailer';
                submissionData = trailer;
                break;
            default:
                return; // Do nothing if no product type is selected
        }
    
        console.log('Submitting:', submissionData);
        
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            // Handle success, maybe clear form or show success message
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle error, maybe show error message to user
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
                </>
            )}
            <button type="submit">Submit</button>
        </form>
    );
};

export default OrderForm;
