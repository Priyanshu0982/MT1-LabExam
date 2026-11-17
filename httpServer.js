
const http = require("http");
const fs = require("fs");
const path = require("path");

let vehicles = [
    {
        id: 1,
        vehicleName: "Honda City",
        vehicleNumber: "UP14AB1234",
        type: "Car",
        price: 1200000
    },
    {
        id: 2,
        vehicleName: "Royal Enfield",
        vehicleNumber: "UP14CD5678",
        type: "Bike",
        price: 180000
    },
    {
        id: 3,
        vehicleName: "Tata Nexon",
        vehicleNumber: "UP14EF9012",
        type: "Car",
        price: 900000
    }
];

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Vehicle Management System</h1>");
    }

    // GET /vehicles
    else if (req.method === "GET" && req.url === "/vehicles") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(vehicles));
    }

    // GET /about
    else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            application: "Vehicle Management System",
            technology: "Node.js HTTP and FS modules",
            port: 3000
        }));
    }

    // GET /info
    else if (req.method === "GET" && req.url === "/info") {
        const filePath = path.join(__dirname, "public", "info.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error: Unable to read info.html");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    // POST /add-vehicle
    else if (req.method === "POST" && req.url === "/add-vehicle") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const newVehicle = JSON.parse(body);

                const { id, vehicleName, vehicleNumber, type, price } = newVehicle;

                if (
                    id === undefined ||
                    !vehicleName ||
                    !vehicleNumber ||
                    !type ||
                    price === undefined
                ) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "All fields are required"
                    }));
                    return;
                }

                vehicles.push(newVehicle);

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Vehicle added successfully",
                    vehicle: newVehicle
                }));

            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    message: "Invalid JSON data"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 - Route Not Found");
    }
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
