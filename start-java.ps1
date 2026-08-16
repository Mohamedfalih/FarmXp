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
$batDir = "C:\temp\farmxp_bats"
New-Item -ItemType Directory -Force -Path $batDir | Out-Null

foreach ($service in $services) {
    Write-Host "Starting $service..."
    $serviceDir = Join-Path $baseDir $service
    if (Test-Path $serviceDir) {
        $logFile = "C:\temp\farmxp_$service.log"
        $jarFile = Get-ChildItem -Path (Join-Path $serviceDir "target") -Filter "*.jar" | Where-Object { $_.Name -notmatch "original" } | Select-Object -First 1
        if ($jarFile) {
            $batFile = Join-Path $batDir "start_$service.bat"
            Set-Content -Path $batFile -Value "@echo off`r`ncd /d `"$serviceDir`"`r`njava -jar `"$($jarFile.FullName)`" > `"$logFile`" 2>&1"
            Start-Process -FilePath $batFile -WindowStyle Hidden
            Write-Host "$service started from $($jarFile.Name)."
        } else {
            Write-Host "No jar found for $service!"
        }
    }
}

Write-Host "Starting Frontend..."
$frontendDir = "D:\FULL STACK JAVA\FarmXp - Integration\FrontEnd"
$frontendBat = Join-Path $batDir "start_frontend.bat"
Set-Content -Path $frontendBat -Value "@echo off`r`ncd /d `"$frontendDir`"`r`nnpm run dev"
Start-Process -FilePath $frontendBat -WindowStyle Minimized

Write-Host "All services launched."
