const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Home Page
app.get('/', (req, res) => {
    res.render('index');
});

// Create Order
app.post('/create-order', async (req, res) => {
    const { plan } = req.body;

    let amount = 0;
    if(plan === 'basic') amount = 50000;   // ₹500 in paise
    if(plan === 'premium') amount = 100000; // ₹1000 in paise

    const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error creating order');
    }
});

// Payment Success
app.post('/success', (req, res) => {
    // You can verify payment here using Razorpay signature if you want
    res.render('success', { discordLink: "https://discord.gg/xWBkRrBD2s" });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');

    console.log("Server file loaded");
});
