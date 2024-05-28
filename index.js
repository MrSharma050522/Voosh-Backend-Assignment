const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const UserRouter = require("./Routes/UserRoute");

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
app.use(cors());

app.use(express.json());
app.get("/", (req, res)=>{
    try {
        res.status(200).json("Home Page");
    } catch (error) {
        console.log("Error -> ", error);
        res.status(400).json(error)
    }
})
// Mount the user routes at the /users endpoint
app.use("/users", UserRouter);

// Define the port to listen on, defaulting to 3005 if not provided in the environment
const PORT = process.env.PORT || 3005;

// Connect to the MongoDB database using the MONGO_URI from the environment variables
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB Connection Successfull");
        console.log("Node Environment :", process.env.NODE_ENV);
        // Start the Express server once the database connection is established
        app.listen(PORT, () => {
            console.log(`Listening to port : ${PORT}`);
        });
    })
    .catch((err) => {
        // Log any errors that occur during the database connection process
        console.log("Error -> ", err.message);
    });
