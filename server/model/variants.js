const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const variantSchema = new Schema({
  sku: String,
  specification: String,
  price: Number,
  product: {
    type: Schema.Types.ObjectId,
    ref: "ProductDb"
  }
})

const VariantDb = mongoose.model('VariantDb', variantSchema);
module.exports = VariantDb;
