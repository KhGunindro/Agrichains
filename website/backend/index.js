import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config'
import cors from 'cors';
// pages
import authController_routes from './routes/authController.routes.js'
import contact_routes from './routes/contact.routes.js'

class ServerSetup {
    constructor() {
        this.PORT = 9000;
        this.MONGODB_URL = process.env.LOCAL_MONGODB_URL; // cloud db
        // this.MONGODB_URL = process.env.LOCAL_MONGODB_URL; // local db
        this.ORIGIN = process.env.ORIGIN;
        this.ORIGIN2 = process.env.ORIGIN2;

        if (!this.MONGODB_URL) {
            console.error("❌ MONGODB_URL is not defined in .env file!");
            process.exit(1);
        }

        this.app = express();
    }

    // Use MongoDB Atlas (cloud-based) for database
    async connectDatabase() {
        try {
            await mongoose.connect(this.MONGODB_URL);
            console.log("✅ Connected to database successfully!");
        } catch (error) {
            console.error("❌ Database connection failed!", error);
            process.exit(1);
        }
    }

    async connectServer() {
        try {
            await this.connectDatabase();

            const allowedORIGINS = [process.env.ORIGIN, process.env.ORIGIN1]; // allowing multiple origins
            const corsOptions = {
                origin: allowedORIGINS,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            };

            this.app.use(cors(corsOptions)); // Enable CORS middleware
            this.app.use(express.json()); // Parse incoming JSON requests
            // api endpoints for authentications
            this.app.use('/account', authController_routes);
            this.app.use('/contact', contact_routes);
            this.app.use('/', (req, res) => {
                res.send("Welcome to the agrichains server!");
            })

            // Global error handler middleware
            this.app.use((err, req, res, next) => {
                console.error(err.stack); // Log the error for debugging

                // Default error response
                const statusCode = err.statusCode || 500;
                const message = err.message || 'Internal Server Error';

                // Send the error response
                res.status(statusCode).json({
                    success: false,
                    message: message,
                    // In JavaScript, exceptions hold a stack property that contains the stack from the place where the exception was thrown.
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack trace only in development
                });
            });

            this.app.listen(this.PORT, '0.0.0.0', () => {
                console.log(`✅ Server is running at http://localhost:${this.PORT}`);
            });

            console.log("✅ Server setup successfully!");

        } catch (error) {
            console.error("❌ Server connection failed!", error);
        }
    }
}

new ServerSetup().connectServer();