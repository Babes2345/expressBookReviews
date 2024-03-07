const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session && req.session.accessToken) {
        // Verify the access token stored in session
        jwt.verify(req.session.accessToken, 'YOUR_SECRET_KEY', (err, decoded) => {
            if (err) {
                // If token verification fails, clear the session and return an unauthorized response
                req.session.destroy();
                return res.status(401).send({ message: 'Unauthorized! Please login again.' });
            }

            // Token is valid
            req.user = decoded; // Optional: Attach user payload to request object
            next(); // Proceed to the next middleware/route handler
        });
    } else {
        // No access token in session, return an unauthorized response
        return res.status(401).send({ message: 'Unauthorized! No access token found.' });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
