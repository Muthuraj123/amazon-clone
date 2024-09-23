const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    orderId: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    receiverName: {
        type: String,
        required: [true, 'Please tell us your receiverName']
    },
    line1: {
        type: String,
        required: [true, 'Please tell us your lane1']
    },
    city: {
        type: String,
        required: [true, 'Please tell us your city']
    },
    pincode: {
        type: String,
        required: [true, 'Please tell us your pincode']
    },
    country: {
        type: String,
        required: [true, 'Please tell us your country']
    },
    amount: {
        type: Number,
        required: [true, 'Please tell us your amount']
    },
    basket: {
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Please tell us your backet']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', ordersSchema);

module.exports = Order;