<# 一键启动 KB UI 开发环境
# 用法：
#   .\start.ps1            启动全部（playground + docs）
#   .\start.ps1 -Web       仅 playground
#   .\start.ps1 -Docs      仅 docs
# 访问：playground http://localhost:5173 · docs http://localhost:5174
param(
  [switch]$Web,
  [switch]$Docs
)

$ErrorActionPreference = "Stop"

# 默认全部
if (-not $Web -and -not $Docs) { $Web = $true; $Docs = $true }

$targets = @()
if ($Web)  { $targets += '"pnpm dev"' }
if ($Docs) { $targets += '"pnpm docs:dev"' }

Write-Host "启动 KB UI 开发环境：$($targets -join ' + ')" -ForegroundColor Cyan
Write-Host "  playground → http://localhost:5173" -ForegroundColor DarkGray
Write-Host "  docs       → http://localhost:5174" -ForegroundColor DarkGray

pnpm exec concurrently -k -n playground,docs -c cyan,magenta @($targets)
