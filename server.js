const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51J00fuSGUWY7RZxWsPcGWATIcV6U6iKkWgq4A5Ede0HWCtI4dfkTJYRerWf7m1YqKTuCthLdYWcUeftIgkq1IvNJ00XD7wgWVO");
const mongoose = require('mongoose');
const Order = require("./models/ordersModel");
const xss = require('xss-clean');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use(xss());

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

app.post("/payments/create", async (req, res) => {
    const { total, receiverName, line1, city, pincode, country } = req.query;
    console.log("Payment Request Received BOOM!", total);
    if (total > 0) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "inr",
            description: "Shopping",
            payment_method_types: ['card'],
            shipping: {
                name: receiverName,
                address: {
                    line1: line1,
                    city: city,
                    postal_code: pincode,
                    country: country
                }
            }
        });
        res.status(201).send({ clientSecret: paymentIntent?.client_secret });
    } else {
        res.status(201).send({ clientSecret: 0 });
    }
});

app.post("/orders/create", async (req, res) => {
    let orderBody = {
        user: req.body.user,
        orderId: req.body.orderId,
        receiverName: req.body.receiverName,
        line1: req.body.line1,
        city: req.body.city,
        country: req.body.country,
        pincode: req.body.pincode,
        basket: req.body.basket,
        amount: req.body.amount,
    }
    let newOrder = await Order.create(orderBody);

    res.status(201).json({
        status: 'success',
        data: newOrder
    });
});

app.post("/orders/get", async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const skip = page * limit;
    const endDateStr = new Date(req.query.edate);
    const endDateStr1 = addOneDayAndFormat(endDateStr);

    if (page && limit) {
        const data = await Order.find({
            createdAt: {
                $gte: new Date(req.query.sdate),
                $lte: new Date(endDateStr1)
            }, user: req.query.user
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);


        res.status(201).json({
            status: 'success',
            data
        })
    } else {
        const data = await Order.find({
            createdAt: {
                $gte: new Date(req.query.sdate),
                $lte: new Date(endDateStr1)
            }, user: req.query.user
        }).sort({ createdAt: -1 });
        res.status(201).json({
            status: 'success',
            data
        })
    }
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can\'t find ${req.originalUrl} on this server!`, 404));
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

mongoose.connect('mongodb+srv://muthurajmarvar8:m12345678@cluster0.uvtfdzz.mongodb.net/natours?retryWrites=true', {
    dbName: "amazon",
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTION SUCCESSFULL.'));

function addOneDayAndFormat(dateStr) {
    // Parse the input date string to a Date object
    const date = new Date(dateStr);

    // Add one day to the date
    date.setUTCDate(date.getUTCDate() + 1);

    // Return the date in ISO format
    return date.toISOString();
}

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log('App runing on port 3001');
});
