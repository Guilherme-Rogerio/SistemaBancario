const express = require('express');
const app = express();

app.use(express.json());

const rotas = require('./rotas');
app.use(rotas);

module.exports = app;