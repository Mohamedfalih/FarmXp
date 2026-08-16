const axios = require('axios');

async function runTest() {
    try {
        const loginRes = await axios.post('http://localhost:9090/api/auth/login', {
            username: 'testadmin',
            password: 'password123'
        });
        const adminToken = loginRes.data.token;

        console.log("3. Fetching /api/farmers/admin/46");
        try {
            const getRes = await axios.get('http://localhost:9090/api/farmers/admin/46', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log("Response:", JSON.stringify(getRes.data, null, 2));
        } catch(e) {
            console.log("Error:", e.response ? e.response.status : e.message);
            console.log("Error data:", e.response ? e.response.data : "");
        }

    } catch(e) {
        console.error("Error during test:", e.response ? e.response.data : e.message);
    }
}

runTest();
