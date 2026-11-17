
const express = require("express");

const app = express();
const PORT = 4000;

// Middleware to parse JSON data
app.use(express.json());

// Initial vehicle records
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "UP14CD5678",
        type: "Sedan",
        price: 1200000
    },
    {
        id: 3,
        vehicleName: "Royal Enfield",
        vehicleNumber: "UP14EF9012",
        type: "Bike",
        price: 180000
    }
];

// Validate vehicle details
function isValidVehicle(vehicle) {
    return (
        vehicle &&
        vehicle.id !== undefined &&
        vehicle.vehicleName &&
        vehicle.vehicleNumber &&
        vehicle.type &&
        typeof vehicle.price === "number" &&
        Number.isFinite(vehicle.price) &&
        vehicle.price > 0
    );
}

// 1. GET - Retrieve all vehicles
app.get("/vehicles", (req, res) => {
    res.status(200).json(vehicles);
});

// 2. GET - Retrieve vehicle by ID
app.get("/vehicles/:id", (req, res) => {
    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    res.status(200).json(vehicle);
});

// 3. POST - Add a new vehicle
app.post("/vehicles", (req, res) => {
    const newVehicle = req.body;

    if (!isValidVehicle(newVehicle)) {
        return res.status(400).json({
            message: "All fields are required and price must be a positive number"
        });
    }

    const existingVehicle = vehicles.find(
        v => v.id === Number(newVehicle.id)
    );

    if (existingVehicle) {
        return res.status(400).json({
            message: "Vehicle ID already exists"
        });
    }

    vehicles.push(newVehicle);

    res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: newVehicle
    });
});

// 4. PUT - Update vehicle by ID
app.put("/vehicles/:id", (req, res) => {
    const id = Number(req.params.id);

    const vehicleIndex = vehicles.findIndex(v => v.id === id);

    if (vehicleIndex === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const updatedVehicle = req.body;

    if (!isValidVehicle(updatedVehicle)) {
        return res.status(400).json({
            message: "All fields are required and price must be a positive number"
        });
    }

    if (Number(updatedVehicle.id) !== id) {
        return res.status(400).json({
            message: "Vehicle ID cannot be changed"
        });
    }

    vehicles[vehicleIndex] = updatedVehicle;

    res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle: updatedVehicle
    });
});

// 5. DELETE - Delete vehicle by ID
app.delete("/vehicles/:id", (req, res) => {
    const id = Number(req.params.id);

    const vehicleIndex = vehicles.findIndex(v => v.id === id);

    if (vehicleIndex === -1) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    const deletedVehicle = vehicles.splice(vehicleIndex, 1);

    res.status(200).json({
        message: "Vehicle deleted successfully",
        vehicle: deletedVehicle[0]
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Invalid JSON data"
        });
    }

    next(err);
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
