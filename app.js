const express = require('express');
const ExpressError = require('./expressError');
const middleware = require("./middleware");
const morgan = require("morgan");

const itemRoutes = require('./Routes/itemRoutes')
const app = express();

app.use(express.json());

app.use(morgan('dev'))

app.use('/items', itemRoutes);

// 404 handler
app.use((req, res) => {
    return new ExpressError("Not Found", 404);
});

// generic error handler
app.use((err, req, res, next) => {
    let status = err.status || 500;

    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

module.exports = app;