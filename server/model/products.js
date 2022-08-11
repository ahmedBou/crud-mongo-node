const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  reference: String,
  name: String,
  description: String,
  image: String,
})

const ProductDb = mongoose.model('ProductDb', productSchema);
module.exports = ProductDb;
