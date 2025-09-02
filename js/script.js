async function buyPlan(plan) {
    try {
        const res = await fetch('/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });

        const order = await res.json();

        const options = {
            key: "<YOUR_KEY_ID>", // Razorpay Key ID
            amount: order.amount,
            currency: "INR",
            name: "Hosting Service",
            description: `${plan} plan`,
            order_id: order.id,
            handler: function () {
                window.location.href = '/success';
            },
            theme: {
                color: "#4F46E5"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error(err);
        alert('Something went wrong. Please try again.');
    }
}
