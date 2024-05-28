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
        const apiUsage = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Management API</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            line-height: 1.6;
                        }
                        h1 {
                            color: #333;
                        }
                        pre {
                            background: #f4f4f4;
                            padding: 10px;
                            border: 1px solid #ddd;
                            overflow-x: auto;
                        }
                    </style>
                </head>
                <body>
                    <h1>Welcome to the User Management API!</h1>
                    <p>Here are the available endpoints and how to use them:</p>

                    <h2>1. Register New User:</h2>
                    <p>
                        <strong>Endpoint:</strong> POST /register-new-user<br>
                        <strong>Description:</strong> Registers a new user with name, email, link to photo (optional), password, phone, and optional bio.<br>
                        <strong>Request Body:</strong>
                    </p>
                    <pre>
    {
        "name": "string",
        "email": "string",
        "password": "string",
        "phone": "string",
        "photo": "string",
        "bio": "string"
    }
                    </pre>
                    <p><strong>Response:</strong> Returns the created user object and a JWT token.</p>

                    <h2>2. Get All Users:</h2>
                    <p>
                        <strong>Endpoint:</strong> GET /get-all-user<br>
                        <strong>Description:</strong> Retrieves all users. Admin users can see all users; others see only public profiles.<br>
                        <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br>
                        <strong>Response:</strong> Returns a list of users.
                    </p>

                    <h2>3. Login Existing User:</h2>
                    <p>
                        <strong>Endpoint:</strong> POST /login-existing-user<br>
                        <strong>Description:</strong> Logs in an existing user using email and password.<br>
                        <strong>Request Body:</strong>
                    </p>
                    <pre>
    {
        "email": "string",
        "password": "string"
    }
                    </pre>
                    <p><strong>Response:</strong> Returns the user object and a JWT token.</p>

                    <h2>4. Get Profile Details:</h2>
                    <p>
                        <strong>Endpoint:</strong> GET /get-profile-detail<br>
                        <strong>Description:</strong> Retrieves the profile details of the logged-in user.<br>
                        <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br>
                        <strong>Response:</strong> Returns the user profile.
                    </p>

                    <h2>5. Edit Profile Details:</h2>
                    <p>
                        <strong>Endpoint:</strong> PATCH /edit-profile-detail<br>
                        <strong>Description:</strong> Edits the profile details of the logged-in user.<br>
                        <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br>
                        <strong>Query Parameters:</strong> photo, name, bio, phone, email<br>
                        <strong>Response:</strong> Returns the updated user profile.
                    </p>

                    <h2>6. Change Password:</h2>
                    <p>
                        <strong>Endpoint:</strong> PATCH /change-password<br>
                        <strong>Description:</strong> Changes the password of the logged-in user.<br>
                        <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br>
                        <strong>Query Parameters:</strong> oldPassword, newPassword<br>
                        <strong>Response:</strong> Returns the updated user profile.
                    </p>

                    <h2>7. Change Profile Visibility:</h2>
                    <p>
                        <strong>Endpoint:</strong> PATCH /change-visibility<br>
                        <strong>Description:</strong> Changes the profile visibility of the logged-in user from public to private or vice versa.<br>
                        <strong>Headers:</strong> Authorization: Bearer &lt;token&gt;<br>
                        <strong>Query Parameters:</strong> password, isPublic<br>
                        <strong>Response:</strong> Returns the updated user profile.
                    </p>

                    <p>Visit the respective endpoints with the required parameters to use the functionalities.</p>
                </body>
                </html>
        `;
        res.status(200).send(apiUsage);
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
