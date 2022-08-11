const ProductDb = require('../model/products');
const VariantDb = require('../model/variants');

// create and save new Product
exports.create_prod = (req, res) => {
  // validate request
  if (!req.body) return res.status(400).send({ message: 'Veuillez remplir les champs requis' });
  let { reference, name, description, image} = req.body;
  if(!(typeof name === 'string' && name.trim())) return res.status(400).send({ status: 'failure', message: 'name is invalid or missing' });
  if(!(typeof reference === 'string' && reference.trim())) return res.status(400).send({ status: 'failure', message: 'reference is invalid or missing' });
  if(!(typeof description === 'string' && description.trim())) return res.status(400).send({ status: 'failure', message: 'description is invalid or missing' });
  if(!(typeof image === 'string' && image.trim())) return res.status(400).send({ status: 'failure', message: 'image is invalid or missing' });

  // new Product
  new ProductDb({
    reference: reference,
    name: name,
    description: description,
    image: req.body.image
  })
  .save()
  .then(async data => {
    if(Array.isArray(req.body.variants)){
      let variants = req.body.variants;
      for(let variant of variants){
        await new VariantDb({
          product: data._id,
          sku: variant.sku,
          specification: variant.specification,
          price: variant.price,
        }).save();
      }
    }
    let variants = await VariantDb.find({product: data._id})
    let product = {
      reference: data.reference,
      name: data.name,
      description: data.description,
      image: data.image,
      id: data.id,
      variants: Array.isArray(variants) ? variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        specification: variant.specification,
        price: variant.price,
      })) : []
    }
    return res.json({status: 'success', product})
  }).catch(err => res.status(500).send({ message: err.message || 'erreur apparru lors de la creation' }));;

};
// create variants

exports.create_variants = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: 'Veuillez remplir les champs requis' });
    return;
  }

  // new Variant
  const variant = new VariantDb({
    sku: req.body.sku,
    specification: req.body.specification,
    price: req.body.price
  });
  // save variants to the database
  variant
    .save(variant)
    .then(data => res.send(data))
    .catch(err => res.status(500)
      .send({ message: err.message || 'erreur apparru lors de la creation' }));


  // const findVariant = await ProductDb.findById({_id: variant.product})
  // findVariant.variant.push(variant);
}



// retrieve and return all product, retrieve and return single product
exports.find_prod = (req, res) => {
  if(req.params.id){
    const id = req.params.id;
    ProductDb.findById(id).then(data =>{
      if(!data){ res.send({}) }
      else{ res.send(data) }
    }).catch(err=>{ res.status(500).send({ message: 'Erreur apparru lors de la mise jour' }) })

  } else {
    ProductDb.find()
      .then(product => res.send(product))
      .catch(err => { res.status(500).send({ message: err.message || 'Erreur apparru lors de la creation' }) })
  }


};

// update a new identified product by product id
exports.update_prod = (req, res) => {
  if(!req.body) return res.status(400).send({message: "veillez remplir les champs a editer "})
  // if(!req.params.id) return res.status(400).send({message: "Product id is required"});
  const id = req.params.id;
  ProductDb.findByIdAndUpdate(id, req.body, {useFindAndModify: false, new: true})
    .then(data=>{
      if(!data) return res.send({status: 'failure', message: `l'utilisateur ${id} est introuvable!`})
      else return res.json({status: 'success', data});
    }).catch(err=>{ res.status(500).send({ message: 'erreur apparru lors de la mise jour' }) })

}

// delete product with specified id in the request

exports.del_prod = (req, res) => {
  const id = req.params.id;
  ProductDb.findByIdAndDelete(id)
    .then(data =>{
      if(!data){ res.status(400).send({status: 'failure', message:`Vous ne pouvez pas suprimer le ${id}, veuillez entrer un id valid `})
      } else { res.send({status: 'success', message: 'L utilisteur a été bien suprimer! '}) }
    }).catch(err=>{ res.status(500).send({ message: 'erreur apparru lors de la supression ' }) })
};


exports.get_variants = async(req, res) => {
  const productId = req.params.id;
  let variants = await VariantDb.find({product: productId})
  variants = Array.isArray(variants) ? variants.map(variant => ({
    id: variant.id,
    sku: variant.sku,
    specification: variant.specification,
    price: variant.price,
  })) : []
    return res.json({status: 'success', variants})
};


exports.get_variant = async(req, res) => {
  const productId = req.params.id;
  const variantId = req.params.variant_id;
  let variant = await VariantDb.findOne({_id: variantId, product: productId})
  variant = variant ? {
    id: variant.id,
    sku: variant.sku,
    specification: variant.specification,
    price: variant.price,
  } : {};
  return res.json({status: 'success', variant})
};
