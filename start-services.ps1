$services = @(
    "eureka-server",
    "api-gateway",
    "auth-service",
    "sustainability-service"
)

foreach ($svc in $services) {
    Write-Host "Starting $svc..."
    Start-Process -FilePath "java" -ArgumentList "-jar", "D:\FULL STACK JAVA\FarmXp - Integration\BackEnd\$svc\target\$svc-0.0.1-SNAPSHOT.jar" -RedirectStandardOutput "C:\temp\farmxp-logs\$svc.log" -RedirectStandardError "C:\temp\farmxp-logs\$svc-error.log" -WindowStyle Hidden
}

Write-Host "Services started. Waiting 60 seconds for Eureka registration..."
Start-Sleep -Seconds 60
Write-Host "Ready."
