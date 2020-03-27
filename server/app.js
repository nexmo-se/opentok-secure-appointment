require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const history = require('connect-history-api-fallback');

const services = require('./services')
const indexRouter = require('./routes');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history());

app.use(express.static(path.join(__dirname, '../client/dist')));
app.set('view engine', 'html');

app.use('/', indexRouter(services));

module.exports = app;
