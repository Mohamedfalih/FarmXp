const axios = require('axios');

async function testAdminFarmers() {
    try {
        // 1. Admin Login
        const loginRes = await axios.post('http://localhost:9090/api/auth/login', {
            username: 'admin@farmxp.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log("Admin logged in.");

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get Farmers
        const farmersRes = await axios.get('http://localhost:9090/api/farmers/admin', config);
        console.log("Admin Farmers List Response:");
        console.log(JSON.stringify(farmersRes.data.slice(0, 2), null, 2));

        if (farmersRes.data.length > 0) {
            const firstFarmer = farmersRes.data[0];
            const farmerId = firstFarmer.farmerId;
            // 3. Get Farmer Details
            try {
                const detailsRes = await axios.get(`http://localhost:9090/api/farmers/admin/${farmerId}`, config);
                console.log(`Admin Farmer Details for ID ${farmerId}:`);
                console.log(JSON.stringify(detailsRes.data, null, 2));
            } catch(e) {
                console.error("Error getting details:", e.response ? e.response.data : e.message);
            }
        }

    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}

testAdminFarmers();
