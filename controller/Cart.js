const { Cart } = require('../model/Cart');

exports.fetchCartByUser = async (req, res) => {
  // req.query vs req.param vs req.body
  // req.query generally used for sorting and filter it takes input in key value pair
  // like?page=10
  // req.param is are the parameter attach to routes generally /parameter
  // req.body contains all the data the actual data and all the properties,etc
  const { id } = req.user;
  try {
    // .populate is use to populate the product whose id is given
    const cartItems = await Cart.find({ user: id }).populate('product');

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = async (req, res) => {
  const {id} = req.user;
  const cart = new Cart({...req.body,user:id});
  try {
    const doc = await cart.save();
    const result = await doc.populate('product');
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
