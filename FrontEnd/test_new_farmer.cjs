const axios = require('axios');

async function runTest() {
    try {
        const unique = Date.now();
        const username = `farmer_${unique}`;
        const email = `farmer_${unique}@test.com`;
        
        console.log(`1. Registering farmer: ${username}`);
        const regRes = await axios.post('http://localhost:9090/api/auth/register', {
            username: username,
            email: email,
            password: 'password123'
        });
        console.log("Registered:", regRes.data);

        console.log("2. Logging in as new farmer...");
        const loginRes = await axios.post('http://localhost:9090/api/auth/login', {
            username: username,
            password: 'password123'
        });
        const farmerToken = loginRes.data.token;
        console.log("Logged in. Token length:", farmerToken.length);

        console.log("3. Creating Farmer Profile...");
        const profileRes = await axios.post('http://localhost:9090/api/farmers/profile', {
            fullName: `Test Farmer ${unique}`,
            phone: '1234567890',
            state: 'TestState',
            district: 'TestDistrict',
            village: 'TestVillage',
            farmName: 'TestFarm',
            farmSize: 5.0,
            farmSizeUnit: 'ACRES'
        }, {
            headers: { Authorization: `Bearer ${farmerToken}` }
        });
        console.log("Profile created:", profileRes.data);

        // Can we view them using Admin? We don't have admin creds, but we can hit internal endpoints directly if we bypass the Gateway or use the gateway.
        // Wait, to hit Admin endpoints we need an ADMIN token! 
        // Can we create an admin user?
        console.log("Attempting to get auth service users using farmer token (expecting 403)...");
        try {
            await axios.get('http://localhost:9090/api/farmers/admin', {
                headers: { Authorization: `Bearer ${farmerToken}` }
            });
        } catch(e) {
            console.log("Expected error for admin access:", e.response ? e.response.status : e.message);
        }

    } catch(e) {
        console.error("Error during test:", e.response ? e.response.data : e.message);
    }
}

runTest();
