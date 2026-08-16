const crypto = require('crypto');

function createJWT(userId, role, username) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { userId, role, sub: username, exp: Math.floor(Date.now() / 1000) + 3600 };
    const secret = 'FarmXPSecretKeyForJWTAuthentication2026VerySecureKey';

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(encodedHeader + '.' + encodedPayload).digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function test() {
    try {
        const adminToken = createJWT(1, 'ADMIN', '1');
        const farmerToken = createJWT(43, 'FARMER', '43');

        console.log("Admin token fetched");

        // Create Scheme via scheme-service directly on port 8086
        console.log("Creating scheme...");
        const res = await fetch('http://127.0.0.1:8086/api/schemes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: "Test Scheme " + Date.now(),
                description: "Test",
                status: "ACTIVE"
            })
        });

        console.log("Create Scheme response:", res.status, await res.text());

        // Wait a little for async processing if any
        await new Promise(r => setTimeout(r, 2000));

        // Get notifications for admin directly from notification-service on port 8087
        const adminNotifs = await fetch('http://127.0.0.1:8087/api/notifications/user/1', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log("Admin Notifications response:", adminNotifs.status, await adminNotifs.text());

        // Get notifications for farmer
        const farmerNotifs = await fetch('http://127.0.0.1:8087/api/notifications/user/43', {
            headers: { 'Authorization': `Bearer ${farmerToken}` }
        });
        console.log("Farmer Notifications response:", farmerNotifs.status, await farmerNotifs.text());

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
