# Deploy remoto del frontend al servidor dev.
#
# Uso:
#   .\scripts\deploy.ps1                 # despliega rama main
#   .\scripts\deploy.ps1 -Branch foo     # despliega otra rama
#   .\scripts\deploy.ps1 -Push           # primero push de los commits locales y luego deploy
#
# Requisitos:
#   - Llave SSH en C:\Users\allan\.ssh\dev-server-openssh
#   - Repo clonado en el servidor en ~/apps/quiniela-mundial-2026-frontend
#     (si no existe, hace clone automático)

[CmdletBinding()]
param(
    [string]$Branch = "main",
    [string]$Server = "192.168.244.128",
    [string]$User   = "aduenas",
    [string]$Key    = "$env:USERPROFILE\.ssh\dev-server-openssh",
    [string]$RepoUrl = "https://github.com/bytecodehn/quiniela-mundial-2026-frontend.git",
    [string]$RepoDir = "~/apps/quiniela-mundial-2026-frontend",
    [int]   $HostPort = 8090,
    [switch]$Push
)

$ErrorActionPreference = "Stop"

function Invoke-Remote([string]$cmd) {
    ssh -i $Key -o StrictHostKeyChecking=no "$User@$Server" $cmd
    if ($LASTEXITCODE -ne 0) { throw "ssh falló (exit $LASTEXITCODE) -> $cmd" }
}

if ($Push) {
    Write-Host "[deploy] Push local -> origin/$Branch" -ForegroundColor Cyan
    git push origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "git push falló" }
}

Write-Host "[deploy] Verificando que exista el repo en $Server..." -ForegroundColor Cyan
$exists = ssh -i $Key -o StrictHostKeyChecking=no "$User@$Server" "test -d $RepoDir/.git && echo yes || echo no"
if ($exists.Trim() -ne "yes") {
    Write-Host "[deploy] Repo no existe, clonando..." -ForegroundColor Yellow
    Invoke-Remote "mkdir -p ~/apps && git clone $RepoUrl $RepoDir"
}

Write-Host "[deploy] Sync remoto del repo (fetch + reset)..." -ForegroundColor Cyan
Invoke-Remote "cd $RepoDir && git fetch --quiet origin $Branch && git reset --hard origin/$Branch && git log --oneline -1"

Write-Host "[deploy] Ejecutando scripts/deploy.sh (branch=$Branch, port=$HostPort) en el servidor..." -ForegroundColor Cyan
Invoke-Remote "BRANCH=$Branch HOST_PORT=$HostPort bash $RepoDir/scripts/deploy.sh"

Write-Host ""
Write-Host "[deploy] Listo. Abrí: http://${Server}:${HostPort}/" -ForegroundColor Green
