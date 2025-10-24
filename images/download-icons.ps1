$baseUrl = "https://img.icons8.com/color/";
$sizes = @(16, 48, 128);
$iconName = "shield";

# Create a temporary directory
$tempDir = Join-Path $PSScriptRoot "temp"
if (-not (Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir | Out-Null
}

foreach ($size in $sizes) {
    $url = "$baseUrl$size/$iconName.png"
    $outputPath = Join-Path $PSScriptRoot "icon$size.png"
    
    Write-Host "Downloading icon size $size..."
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath
        Write-Host "Downloaded: $outputPath"
        
        # Create waiting version (with clock overlay)
        Copy-Item -Path $outputPath -Destination (Join-Path $PSScriptRoot "icon$($size)_waiting.png")
        
        # Create new version (with notification badge)
        Copy-Item -Path $outputPath -Destination (Join-Path $PSScriptRoot "icon$($size)_new.png")
    }
    catch {
        Write-Host "Failed to download icon size $size: $_"
    }
}

Write-Host "Icon download complete!"
