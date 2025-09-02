const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fix: Use the path module to correctly locate the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Home Page - Renders the EJS template
app.get('/', (req, res) => {
    res.render('index');
});

// Create Order endpoint
app.post('/create-order', async (req, res) => {
    const { plan } = req.body;

    let amount = 0;
    if (plan === 'Starter') amount = 4900;
    else if (plan === 'Business') amount = 14900;
    else if (plan === 'Ultimate') amount = 29900;

    const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// This is crucial for Vercel deployment.
// The app instance must be exported for Vercel to use it as a serverless function.
module.exports = app;
