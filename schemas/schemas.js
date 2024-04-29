// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/fake_ozon');
let Schema = mongoose.Schema;
//схемы
let BuyerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
});

let SupplierSchema = new Schema({
    name: { type: String, required: true },
    inn: { type: String, required: true },
    email: { type: String, required: true }
});

let ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String },
    characteristics: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'categories' },
    manufacturer: { type: Schema.Types.ObjectId, ref: 'suppliers', required: true }
});

let CartSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: 'buyers', required: true },
    cartItems: [{ type: Schema.Types.ObjectId, ref: 'cart_items', required: true }],
});

let CartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true },
    cart: { type: Schema.Types.ObjectId, ref: 'carts' }
});

let OrderSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: 'buyers', required: true },
    totalCost: { type: Number}, 
    orderedProducts: [{ type: Schema.Types.ObjectId, ref: 'products' }],
    pickupPoint: { type: Schema.Types.ObjectId, ref: 'pickup_points' }
});


let CategorySchema = new Schema({
    name: { type: String, required: true }
});

let PickupPointSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true }
});
// модели
let Buyer = mongoose.model('buyers', BuyerSchema);
let Supplier = mongoose.model('suppliers', SupplierSchema);
let Product = mongoose.model('products', ProductSchema);
let CartItem = mongoose.model('cart_items', CartItemSchema);
let Cart = mongoose.model('carts', CartSchema);
let Order = mongoose.model('orders', OrderSchema);
let Category = mongoose.model('categories', CategorySchema);
let PickupPoint = mongoose.model('pickup_points', PickupPointSchema);
// расшариваем
module.exports = { Buyer, Supplier, Product, CartItem, Order, Category, PickupPoint,Cart };
