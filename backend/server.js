const { PrismaClient } = require('@prisma/client');
const app = require('./app');
const dotenv = require('dotenv');

// Config
dotenv.config({path:'./config/config.env'})

// Connecting to Database

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on the url : - http://localhost:${process.env.PORT}`);
})

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to unhandled Exception`);
    process.exit(1)
})

// Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);

    server.close(()=>{
        process.exit(1);
    })
})