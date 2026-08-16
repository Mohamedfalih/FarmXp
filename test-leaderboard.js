const BASE_URL = "http://localhost:9090/api";

async function runTest() {
    console.log("Waiting 30 seconds for services to start...");
    await new Promise(r => setTimeout(r, 30000));

    const num = Math.floor(Math.random() * 9000) + 1000;
    const username = `farmer${num}`;

    console.log(`\nRegistering ${username}...`);
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            email: `${username}@example.com`,
            password: "password123"
        })
    });
    console.log("Register:", regRes.status);

    const logRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            password: "password123"
        })
    });
    const logData = await logRes.json();
    const token = logData.token;
    console.log("Login OK");

    const headers = { "Authorization": `Bearer ${token}` };

    console.log("\n--- Getting Leaderboard ---");
    const lbRes = await fetch(`${BASE_URL}/sustainability/leaderboard?period=ALL`, { headers });
    console.log("Leaderboard status:", lbRes.status);
    if (lbRes.status === 200) {
        console.log(JSON.stringify(await lbRes.json(), null, 2));
    } else {
        console.log(await lbRes.text());
    }

    console.log("\n--- Getting Notifications ---");
    const notifRes = await fetch(`${BASE_URL}/notifications/my`, { headers });
    console.log("Notifications status:", notifRes.status);
    if (notifRes.status === 200) {
        console.log("OK");
    } else {
        console.log(await notifRes.text());
    }
}

runTest().catch(console.error);
