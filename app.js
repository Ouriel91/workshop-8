const express = require('express');
const compression = require('compression');
require('express-async-errors');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error_handler');
const jediRouter = require('./routers/jediRouter');
const port = 8080;
const app = express();

app.use([logger, compression(), express.json()]);
app.use('/static', express.static('public'));
app.use('/jedi', jediRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        health: 'ok'
    });
});

app.post('/error', async (req, res, next) => {
    try {
        let error = Error("My shiny error");
        error.statusCode = 400;
        throw error;
    } catch (e) {
        next(e);
    }
});


process.on('unhandledRejection', (reason, promise) => {
    console.log("Unhandled Rejection", reason.message);
    throw reason
});

process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception", error.message);
    process.exit(1);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log("Server started on port", port);
});