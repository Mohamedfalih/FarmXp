$services = @(
    "eureka-server",
    "config-server",
    "api-gateway",
    "auth-service",
    "farmer-service",
    "market-service",
    "scheme-service",
    "sustainability-service",
    "learning-service",
    "notification-service",
    "ai-service"
)

foreach ($service in $services) {
    Write-Host "Starting $service..."
    Start-Process -FilePath "java" -ArgumentList "-jar target\$service-0.0.1-SNAPSHOT.jar" -WorkingDirectory "D:\FULL STACK JAVA\FarmXp - Integration\BackEnd\$service" -WindowStyle Minimized
    Start-Sleep -Seconds 10
}
Write-Host "All services started."
