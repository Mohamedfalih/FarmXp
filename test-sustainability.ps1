$adminToken = (Invoke-RestMethod -Uri "http://localhost:9090/api/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"admin", "password":"Admin@123"}').token
$farmerToken = (Invoke-RestMethod -Uri "http://localhost:9090/api/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"testfarmer", "password":"Farmer@123"}').token

Write-Host "--- TEST SUSTAINABILITY FLOW ---"
$headers = @{Authorization="Bearer $farmerToken"}

# Add Water Use
$waterBody = @{
    metricType = "WATER_USE"
    baselineValue = 600.0
    currentValue = 500.5
    unit = "Liters"
    recordedDate = "2026-08-14"
} | ConvertTo-Json
Write-Host "Adding WATER_USE metric..."
$waterRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/metrics" -Method Post -ContentType "application/json" -Headers $headers -Body $waterBody
Write-Host "WATER_USE Response: $($waterRes | ConvertTo-Json -Compress)"

# Add Chemical Input
$chemBody = @{
    metricType = "CHEMICAL_INPUT"
    baselineValue = 30.0
    currentValue = 20.0
    unit = "kg"
    recordedDate = "2026-08-14"
} | ConvertTo-Json
Write-Host "Adding CHEMICAL_INPUT metric..."
$chemRes = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/metrics" -Method Post -ContentType "application/json" -Headers $headers -Body $chemBody
Write-Host "CHEMICAL_INPUT Response: $($chemRes | ConvertTo-Json -Compress)"

# Admin Get Pending
Write-Host "Admin checking pending verifications..."
$adminHeaders = @{Authorization="Bearer $adminToken"}
$pending = Invoke-RestMethod -Uri "http://localhost:9090/api/sustainability/verification/pending" -Method Get -Headers $adminHeaders
Write-Host "Pending count: $($pending.Count)"

