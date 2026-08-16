$adminToken = (Invoke-RestMethod -Uri "http://localhost:9090/api/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"admin", "password":"Admin@123"}').token
$farmerToken = (Invoke-RestMethod -Uri "http://localhost:9090/api/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"testfarmer", "password":"Farmer@123"}').token

Write-Host "--- TEST SUSTAINABILITY PRACTICE FLOW ---"
$headers = @{Authorization="Bearer $farmerToken"}
$adminHeaders = @{Authorization="Bearer $adminToken"}

# Add Practice
$practiceBody = @{
    practiceName = "Crop Rotation"
    description = "Rotated crops"
    category = "SOIL_HEALTH"
    evidence = "http://example.com/evidence.jpg"
} | ConvertTo-Json
Write-Host "Adding Practice..."
$practiceRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/practices" -Method Post -ContentType "application/json" -Headers $headers -Body $practiceBody
Write-Host "Practice Response: $($practiceRes | ConvertTo-Json -Compress)"
$practiceId = $practiceRes.practiceId

# Admin Get Pending
Write-Host "Admin checking pending verifications..."
$pending = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/verification/pending" -Method Get -Headers $adminHeaders
Write-Host "Pending count: $($pending.Count)"

if ($practiceId) {
    Write-Host "Admin verifying practice $practiceId..."
    $verifyBody = @{
        approved = $true
    } | ConvertTo-Json
    $verifyRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/verification/$practiceId" -Method Put -ContentType "application/json" -Headers $adminHeaders -Body $verifyBody
    Write-Host "Verify Response: $($verifyRes | ConvertTo-Json -Compress)"
}

