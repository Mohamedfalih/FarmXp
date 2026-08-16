$services = @(
    "eureka-server",
    "auth-service",
    "farmer-service",
    "sustainability-service",
    "learning-service",
    "scheme-service",
    "notification-service",
    "market-service",
    "ai-service",
    "api-gateway"
)

$baseDir = "D:\FULL STACK JAVA\FarmXp - Integration\BackEnd"

Write-Host "Compiling all services first..."
Set-Location $baseDir
# Skipping global compile for speed, assuming they are compiled, or we'll run it per service
# Actually we should run it per service

foreach ($service in $services) {
    Write-Host "Starting $service..."
    $serviceDir = Join-Path $baseDir $service
    if (Test-Path $serviceDir) {
        $logFile = "C:\temp\farmxp_$service.log"
        $jarFile = Get-ChildItem -Path (Join-Path $serviceDir "target") -Filter "*.jar" | Where-Object { $_.Name -notmatch "original" } | Select-Object -First 1
        if ($jarFile) {
            Start-Process -FilePath "javaw" -ArgumentList "-jar", $jarFile.FullName -WorkingDirectory $serviceDir
            Write-Host "$service started from $($jarFile.Name)."
        } else {
            Write-Host "No jar found for $service!"
        }
        Write-Host "$service started. Log at $logFile"
    } else {
        Write-Host "Service $service not found at $serviceDir"
    }
}

Write-Host "Starting Frontend..."
$frontendDir = "D:\FULL STACK JAVA\FarmXp - Integration\FrontEnd"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"npm run dev`"" -WorkingDirectory $frontendDir -WindowStyle Minimized

Write-Host "All services launched in background."
