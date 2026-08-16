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
        const adminToken = createJWT(1, 'ADMIN', 'admin1@farmxp.com');

        const res = await fetch('http://127.0.0.1:9090/api/market/buyers', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log("Status:", res.status);
        console.log("Response:", await res.text());

    } catch (e) {
        console.error("Error:", e);
    }
}

test();
