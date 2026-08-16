$adminToken = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJkZW1vLmFkbWluQGZhcm14cC5jb20iLCJ1c2VySWQiOjU0LCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODY2OTk0NjcsImV4cCI6MTc4Njc4NTg2N30.XfbjY8IHpq3SBW_DGtDBFvW4qye5_6iPaiGaUeEciv5-ozH6SrEPwKcmheo9tnpl"
$farmerToken = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJkZW1vLmZhcm1lckBmYXJteHAuY29tIiwidXNlcklkIjo1Mywicm9sZSI6IkZBUk1FUiIsImlhdCI6MTc4NjY5OTQ2NywiZXhwIjoxNzg2Nzg1ODY3fQ.L-1bmb597QRQEe40wx3mYWoX9ZqQ7mmM4R9VaWESAgDytjQOWHXHWnYWjwe5xjjA"

Write-Host "`n--- TEST 1: Admin Creates Learning Module ---"
$moduleBody = @{
    title = "Advanced Soil Conservation"
    description = "Learn how to conserve soil efficiently."
    category = "SOIL HEALTH"
    xpReward = 500
    durationMinutes = 30
    moduleType = "COURSE"
    status = "PUBLISHED"
    displayOrder = 1
} | ConvertTo-Json

try {
    $createModuleRes = Invoke-RestMethod -Uri "http://localhost:9090/api/learning/admin/modules" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType "application/json" -Body $moduleBody
    Write-Host "Create Module Response:"
    $createModuleRes | ConvertTo-Json
} catch {
    Write-Host "Create Module Error: $_"
}

Write-Host "`n--- TEST 2: Farmer Fetches Learning Modules ---"
try {
    $modules = Invoke-RestMethod -Uri "http://localhost:9090/api/learning/modules" -Method Get -Headers @{ Authorization = "Bearer $farmerToken" }
    Write-Host "Farmer Modules count: $($modules.Count)"
    $modules | Select-Object -Last 1 | ConvertTo-Json
} catch {
    Write-Host "Fetch Modules Error: $_"
}

Write-Host "`n--- TEST 4: Farmer Submits Practice Verification ---"
$practiceBody = @{
    category = "WATER"
    practiceName = "Drip Irrigation Setup"
    description = "Installed 50m of drip lines."
    evidence = "http://example.com/evidence.jpg"
} | ConvertTo-Json

try {
    $verificationRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/practices" -Method Post -Headers @{ Authorization = "Bearer $farmerToken" } -ContentType "application/json" -Body $practiceBody
    Write-Host "Verification Request Response:"
    $verificationRes | ConvertTo-Json
} catch {
    Write-Host "Verification Request Error: $_"
}

Write-Host "`n--- TEST 5: Admin Approves Practice Verification ---"
try {
    # Get pending verifications first
    $pending = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/verification/pending" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
    Write-Host "Pending Verifications: $($pending.Count)"
    if ($pending.Count -gt 0) {
        $firstPending = $pending[0]
        $verifyBody = @{
            approved = $true
            comments = "Great job conserving water."
            awardedXp = 100
            tokenReward = 10.0
        } | ConvertTo-Json
        
        $approveRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/verification/$($firstPending.practiceLogId)" -Method Put -Headers @{ Authorization = "Bearer $adminToken" } -ContentType "application/json" -Body $verifyBody
        Write-Host "Approve Verification Response:"
        $approveRes | ConvertTo-Json
    } else {
        Write-Host "No pending verifications found for admin!"
    }
} catch {
    Write-Host "Approve Verification Error: $_"
}
