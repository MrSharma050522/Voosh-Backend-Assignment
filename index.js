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
            Welcome to the User Management API! Here are the available endpoints and how to use them:

            1. Register New User:
               - Endpoint: POST /register-new-user
               - Description: Registers a new user with name, email, link to photo(optional), password, phone, and optional bio.
               - Request Body: 
                 {
                     "name": "string",
                     "email": "string",
                     "password": "string",
                     "phone": "string",
                     "photo": "string",
                     "bio": "string"
                 }
               - Response: Returns the created user object and a JWT token.

            2. Get All Users:
               - Endpoint: GET /get-all-user
               - Description: Retrieves all users. Admin users can see all users; others see only public profiles.
               - Headers: Authorization: Bearer <token>
               - Response: Returns a list of users.

            3. Login Existing User:
               - Endpoint: POST /login-existing-user
               - Description: Logs in an existing user using email and password.
               - Request Body:
                 {
                     "email": "string",
                     "password": "string"
                 }
               - Response: Returns the user object and a JWT token.

            4. Get Profile Details:
               - Endpoint: GET /get-profile-detail
               - Description: Retrieves the profile details of the logged-in user.
               - Headers: Authorization: Bearer <token>
               - Response: Returns the user profile.

            5. Edit Profile Details:
               - Endpoint: PATCH /edit-profile-detail
               - Description: Edits the profile details of the logged-in user.
               - Headers: Authorization: Bearer <token>
               - Query Parameters: photo, name, bio, phone, email
               - Response: Returns the updated user profile.

            6. Change Password:
               - Endpoint: PATCH /change-password
               - Description: Changes the password of the logged-in user.
               - Headers: Authorization: Bearer <token>
               - Query Parameters: oldPassword, newPassword
               - Response: Returns the updated user profile.

            7. Change Profile Visibility:
               - Endpoint: PATCH /change-visibility
               - Description: Changes the profile visibility of the logged-in user from public to private or vice versa.
               - Headers: Authorization: Bearer <token>
               - Query Parameters: password, isPublic
               - Response: Returns the updated user profile.

            Visit the respective endpoints with the required parameters to use the functionalities.
        `;
        res.status(200).json(apiUsage);
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
