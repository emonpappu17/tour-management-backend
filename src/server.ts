/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from "./app";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://touradmin:touradmin@cluster0.aezqr.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0")

        console.log("Connected to DB!");

        server = app.listen(5000, () => {
            console.log("Server is listing to port 5000");
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();

process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved...  Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved...  Server shutting down..");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected...  Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException", (err) => {
    console.log("Unhandled Exception detected...  Server shutting down..", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)
})

// unhandled rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// uncaught exception error
// throw new Error("I forgot to handle this local error")

// unhandled rejection error
// uncaught rejection error
// signal termination sigterm

