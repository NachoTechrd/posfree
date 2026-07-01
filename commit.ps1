param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Mensaje
)

$mensajeCommit = $Mensaje -join " "
$ramaActual = git branch --show-current

git add -A
git commit -m "$mensajeCommit"

if ($LASTEXITCODE -eq 0) {
    git push origin $ramaActual
}