"use strict";
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require("./config/index")
require('./database');
// Mongoose.connection.getClient()
const UserRoute = require("./routes/user")
const PostRoute = require("./routes/post")
const { handleError } = require("./middlewares/globalErrorHandler")
const { authCheck } = require("./middlewares/authCheck")
const { logger } = require('./middlewares/logger');
const { successRes } = require("./utils/formatRes")

const app = express();

app.use(logger);
app.use(bodyParser.urlencoded({ extended: false, limit: '5000kb' }));
app.use(bodyParser.json({ limit: '5000kb' }));
app.use(bodyParser.raw());
app.use(bodyParser.text());


// static urls
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', function (req, res) {
    res.send("Welcome to the server.\n")
    return;
})
app.use('/auth', UserRoute);
app.use('/post', authCheck, PostRoute);
app.all("*", (req, res) => {
    successRes(
        res,
        null,
        "Page Not Found.",
        404
    )
    return;
})

// handle Global errors
app.use(handleError);

app.listen(config.port, () => console.info(`Server is running on port: ${config.port}`))

