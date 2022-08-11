const express = require('express');
const {del_prod, update_prod, find_prod, create_prod, create_variants, get_variants, get_variant} = require('../controller/controller');
const route = express.Router()

// Endpoints
route.get('/product', find_prod);
route.post('/product', create_prod);
route.delete('/product/:id', del_prod);
route.patch('/product/:id', update_prod);
route.get('/product/:id/variants/', get_variants);
route.get('/product/:id/variants/:variant_id', get_variant);
route.post('/variant', create_variants)

module.exports = route;
