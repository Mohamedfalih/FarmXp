async function testNotifications() {
    try {
        // 1. Login as Farmer
        console.log("Logging in as Farmer...");
        const farmerRes = await fetch('http://localhost:9090/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'alice_farmer', password: 'password123' })
        });
        const farmerData = await farmerRes.json();
        const farmerToken = farmerData.token;
        console.log("Farmer token:", farmerToken ? farmerToken.substring(0, 20) + "..." : "FAILED");

        // 2. Login as Admin
        console.log("Logging in as Admin...");
        const adminRes = await fetch('http://localhost:9090/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password123' })
        });
        const adminData = await adminRes.json();
        const adminToken = adminData.token;
        console.log("Admin token:", adminToken ? adminToken.substring(0, 20) + "..." : "FAILED");

        // 3. Get Farmer Notifications
        console.log("Fetching Farmer Notifications...");
        const farmerNotifsRes = await fetch('http://localhost:9090/api/notifications/my', {
            headers: { Authorization: `Bearer ${farmerToken}` }
        });
        const farmerNotifs = await farmerNotifsRes.json();
        console.log("Farmer Notifications:");
        console.log(JSON.stringify(farmerNotifs, null, 2));

        // 4. Get Admin Notifications
        console.log("Fetching Admin Notifications...");
        const adminNotifsRes = await fetch('http://localhost:9090/api/notifications/my', {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const adminNotifs = await adminNotifsRes.json();
        console.log("Admin Notifications:");
        console.log(JSON.stringify(adminNotifs, null, 2));

    } catch (e) {
        console.error("Error:", e.message);
    }
}

testNotifications();
