const mongoose = require('mongoose');
const {Schema} = mongoose;


const cartSchema = new Schema({
    quantity: { type : Number, required: true},
    // ref de diya product or user ka dusre ab wo khud populate kar dega
    // The ref option is what tells mongoose.js which model to use during population
    // we have told mongoose to use the id from our productModel to fill the product field in cartmodel during population.
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true},
    user:{ type: Schema.Types.ObjectId, ref: 'User', required: true}
})
// frontend me har jagah id hai to _id hai backmend me usko change karne ke liye id me virtual use kiya hain
// database me id rahega but frontend me ya response me id aaega _id ke bajae
const virtual  = cartSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
cartSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function (doc,ret) { delete ret._id}
})


exports.Cart = mongoose.model('Cart',cartSchema)