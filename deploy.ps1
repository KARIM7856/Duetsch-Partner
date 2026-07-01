<#
.SYNOPSIS
  Deploy the DeutschFlow frontend (Next.js, in ./frontend) to Vercel.

.DESCRIPTION
  Links the ./frontend directory to a Vercel project and deploys it.
  Vercel builds the app remotely, so no local build/node_modules is required.

  The Vercel token is read from the -Token parameter or the VERCEL_TOKEN
  environment variable. It is NEVER stored in this file or committed.

.EXAMPLE
  $env:VERCEL_TOKEN = "<your-token>"
  ./deploy.ps1                          # production deploy, auto-link
  ./deploy.ps1 -Project deutschflow     # link to an existing project by name
  ./deploy.ps1 -Preview                 # preview deploy instead of production
  ./deploy.ps1 -SyncEnv                 # also push GEMINI/OPENAI keys from frontend/.env
#>
param(
  [string]$Token = $env:VERCEL_TOKEN,
  [string]$Project = $env:VERCEL_PROJECT,
  [switch]$Preview,
  [switch]$SyncEnv
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Token)) {
  Write-Host "ERROR: No Vercel token found." -ForegroundColor Red
  Write-Host 'Set it first, e.g.:  $env:VERCEL_TOKEN = "<your-token>"   (or pass -Token <token>)'
  exit 1
}

$FrontendDir = Join-Path $PSScriptRoot "frontend"
if (-not (Test-Path (Join-Path $FrontendDir "package.json"))) {
  Write-Host "ERROR: frontend/package.json not found at $FrontendDir" -ForegroundColor Red
  exit 1
}

# Run a Vercel CLI command via npx (auto-installs the CLI). The $Label is what
# gets printed/thrown so the token in the arguments is never echoed.
function Invoke-Vercel {
  param(
    [Parameter(Mandatory)][string]$Label,
    [Parameter(ValueFromRemainingArguments)][string[]]$VArgs
  )
  Write-Host "-> $Label" -ForegroundColor Cyan
  & npx --yes vercel@latest @VArgs
  if ($LASTEXITCODE -ne 0) { throw "$Label failed (exit $LASTEXITCODE)" }
}

# Deploy from the repo ROOT. The Vercel project's Root Directory is set to
# "frontend", so Vercel builds ./frontend from there. (Deploying from inside
# ./frontend makes Vercel look for frontend/frontend and return a 404.)
Push-Location $PSScriptRoot
try {
  # 1. Link the repo to a Vercel project (creates one if it doesn't exist).
  $linkArgs = @("link", "--yes", "--token", $Token)
  if (-not [string]::IsNullOrWhiteSpace($Project)) { $linkArgs += @("--project", $Project) }
  Invoke-Vercel "Linking Vercel project" @linkArgs

  # 2. Optionally push runtime secrets from frontend/.env to the production env.
  #    The app needs GEMINI_API_KEY (Grammar + meine Puppe) and, for the Speak
  #    tab, OPENAI_API_KEY. Without these the API routes return 500 at runtime.
  if ($SyncEnv) {
    foreach ($name in @("GEMINI_API_KEY", "OPENAI_API_KEY")) {
      $line = Get-Content (Join-Path $FrontendDir ".env") -ErrorAction SilentlyContinue |
        Where-Object { $_ -match "^\s*$name=" } | Select-Object -First 1
      if ($line) {
        $value = ($line -replace "^\s*$name=", "").Trim().Trim('"')
        Write-Host "-> Setting $name (production)" -ForegroundColor Cyan
        # Remove any existing value first (ignore failure if it doesn't exist),
        # then add the current one via stdin.
        & npx --yes vercel@latest env rm $name production --yes --token $Token | Out-Null
        $value | & npx --yes vercel@latest env add $name production --token $Token
        if ($LASTEXITCODE -ne 0) { Write-Host "   WARNING: could not set $name; set it in the Vercel dashboard." -ForegroundColor Yellow }
      }
      else {
        Write-Host "   (skipped $name - not found in frontend/.env)" -ForegroundColor DarkGray
      }
    }
  }

  # 3. Deploy. Vercel builds remotely; the URL is printed on success.
  $target = if ($Preview) { @() } else { @("--prod") }
  Invoke-Vercel "Deploying to Vercel" deploy @target "--yes" "--token" $Token

  Write-Host "`nDeploy finished." -ForegroundColor Green
  if (-not $SyncEnv) {
    Write-Host "Reminder: ensure GEMINI_API_KEY (and OPENAI_API_KEY for Speak) are set in the Vercel project," -ForegroundColor Yellow
    Write-Host "or re-run with -SyncEnv to push them from frontend/.env." -ForegroundColor Yellow
  }
}
finally {
  Pop-Location
}
