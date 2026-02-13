$ErrorActionPreference = "Stop"

$jdkCandidates = @(
  "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.8.7-hotspot",
  "C:\\Program Files\\Java\\jdk-20"
)

$jdkHome = $jdkCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $jdkHome) {
  Write-Error "No supported JDK found. Install JDK 17+ and rerun."
}

$env:JAVA_HOME = $jdkHome
$env:Path = "$jdkHome\\bin;$env:Path"

Push-Location $PSScriptRoot
try {
  & ".\\mvnw.cmd" -DskipTests spring-boot:run
}
finally {
  Pop-Location
}
