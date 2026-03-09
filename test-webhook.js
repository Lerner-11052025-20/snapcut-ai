const testWebhook = async () => {
    try {
        const response = await fetch('https://deep7204.app.n8n.cloud/webhook/purchase-made', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: 'dev123',
                userEmail: 'dev@test.com',
                paymentId: 'pay_ABC',
                orderId: 'order_XYZ',
                status: 'success',
                plan: 'PRO',
                timestamp: new Date().toISOString()
            })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (err) {
        console.error('Error:', err);
    }
};

testWebhook();
