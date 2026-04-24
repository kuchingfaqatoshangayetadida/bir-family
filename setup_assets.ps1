$sourceDir = "C:\Users\Acer\.gemini\antigravity\brain\5ae5a352-245b-4170-988b-10087472da3f"
$destDir = "c:\Users\Acer\Downloads\big-family\public\assets\images"

if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force
}

$files = @(
    "great_grandfather", "great_grandmother", "grandfather", "grandmother",
    "father", "mother", "uncle", "aunt", "older_brother", "older_sister",
    "younger_brother", "younger_sister", "cousin_male", "cousin_female", "baby"
)

foreach ($name in $files) {
    try {
        $sourceFile = Get-ChildItem -Path $sourceDir -Filter "${name}_png_*.png" | Select-Object -First 1
        if ($sourceFile) {
            Copy-Item -Path $sourceFile.FullName -Destination "$destDir/${name}.png" -Force -ErrorAction Stop
            Write-Host "SUCCESS: Copied ${name}.png"
        }
        else {
            Write-Warning "NOT FOUND: ${name}"
        }
    }
    catch {
        Write-Error "FAILED: ${name} - $($_.Exception.Message)"
    }
}
