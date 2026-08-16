$services = @("eureka-server", "api-gateway", "auth-service", "farmer-service", "learning-service", "market-service", "scheme-service", "sustainability-service", "notification-service", "ai-service")

foreach ($service in $services) {
    Write-Host "Starting $service..."
    Start-Process -FilePath "powershell" -ArgumentList "-WindowStyle Hidden -Command cd `"D:\FULL STACK JAVA\FarmXp - Integration\BackEnd\$service`"; .\mvnw.cmd spring-boot:run" -PassThru
}

Write-Host "Starting FrontEnd..."
Start-Process -FilePath "powershell" -ArgumentList "-WindowStyle Hidden -Command cd `"D:\FULL STACK JAVA\FarmXp - Integration\FrontEnd`"; npm run dev" -PassThru

Write-Host "All services started in background."
