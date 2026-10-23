# =====================================================================
# SCRIPT DE DESBLOQUEO Y LIMPIEZA MASIVA DE WINDOWS 10 (INCLUYE ADOBE)
# Ejecutar como Administrador
# =====================================================================

Write-Host "Iniciando proceso de limpieza integral..." -ForegroundColor Cyan

# 1. ELIMINAR MICROSOFT STORE
Write-Host "1. Eliminando Microsoft Store..." -ForegroundColor Yellow
Get-AppxPackage *windowsstore* -AllUsers | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.PackageName -like "*WindowsStore*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# 2. ELIMINAR ROBLOX (Del sistema y de perfiles de usuario)
Write-Host "2. Buscando y eliminando Roblox..." -ForegroundColor Yellow
Get-AppxPackage *roblox* -AllUsers | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-Process -Name "RobloxPlayerBeta" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-ChildItem -Path "C:\Users" -Filter "Roblox" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
# =====================================================================
# BORRADO PROFUNDO DE ROBLOX EN TODOS LOS PERFILES DE USUARIO
# =====================================================================

Write-Host "Iniciando eliminacion profunda de Roblox..." -ForegroundColor Cyan

# 1. Finalizar cualquier proceso de Roblox que este corriendo en segundo plano
Get-Process -Name "*Roblox*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "*RobloxPlayerBeta*" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Desinstalar paquete AppX para todos los usuarios
Get-AppxPackage -AllUsers *roblox* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*roblox*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# 3. Eliminar carpetas fisicas de Roblox en C:\Users\(Todos los perfiles, incl. Alumno)
$userProfiles = Get-ChildItem -Path "C:\Users" -Directory | Where-Object { $_.Name -notmatch "Public|All Users" }

foreach ($profile in $userProfiles) {
    $robloxPaths = @(
        "$($profile.FullName)\AppData\Local\Roblox",
        "$($profile.FullName)\AppData\Local\Packages\*Roblox*",
        "$($profile.FullName)\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Roblox",
        "$($profile.FullName)\Desktop\Roblox*.lnk"
    )
    
    foreach ($path in $robloxPaths) {
        if (Test-Path $path) {
            Write-Host "Eliminando Roblox en: $path" -ForegroundColor Yellow
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# =====================================================================
# BORRADO PROFUNDO DE ROBLOX EN TODOS LOS PERFILES DE USUARIO
# =====================================================================



Write-Host "Iniciando eliminacion profunda de Roblox..." -ForegroundColor Cyan

# 1. Finalizar cualquier proceso de Roblox que este corriendo en segundo plano
Get-Process -Name "*Roblox*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "*RobloxPlayerBeta*" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Desinstalar paquete AppX para todos los usuarios
Get-AppxPackage -AllUsers *roblox* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*roblox*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# 3. Eliminar carpetas fisicas de Roblox en C:\Users\(Todos los perfiles, incl. Alumno)
$userProfiles = Get-ChildItem -Path "C:\Users" -Directory | Where-Object { $_.Name -notmatch "Public|All Users" }

foreach ($profile in $userProfiles) {
    $robloxPaths = @(
        "$($profile.FullName)\AppData\Local\Roblox",
        "$($profile.FullName)\AppData\Local\Packages\*Roblox*",
        "$($profile.FullName)\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Roblox",
        "$($profile.FullName)\Desktop\Roblox*.lnk"
    )
    
    foreach ($path in $robloxPaths) {
        if (Test-Path $path) {
            Write-Host "Eliminando Roblox en: $path" -ForegroundColor Yellow
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 4. Eliminar accesos directos publicos del escritorio
Remove-Item -Path "C:\Users\Public\Desktop\Roblox*.lnk" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Roblox*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Roblox ha sido eliminado por completo de todos los perfiles." -ForegroundColor Green
# 4. Eliminar accesos directos publicos del escritorio
Remove-Item -Path "C:\Users\Public\Desktop\Roblox*.lnk" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Roblox*" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Roblox ha sido eliminado por completo de todos los perfiles." -ForegroundColor Green

# 3. ELIMINAR DROPBOX
Write-Host "3. Eliminando Dropbox..." -ForegroundColor Yellow
Get-Process -Name "*dropbox*" -ErrorAction SilentlyContinue | Stop-Process -Force
$dropboxPaths = @(
    "C:\Program Files (x86)\Dropbox",
    "C:\Program Files\Dropbox",
    "$env:LOCALAPPDATA\Dropbox",
    "$env:APPDATA\Dropbox"
)
foreach ($path in $dropboxPaths) {
    if (Test-Path $path) { Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue }
}

# 4. ELIMINAR MICROSOFT EDGE Y WEBVIEW2
Write-Host "4. Desinstalando Microsoft Edge y WebView2..." -ForegroundColor Yellow
Get-Process -Name "*msedge*" -ErrorAction SilentlyContinue | Stop-Process -Force

$edgeInstaller = Get-ChildItem -Path "C:\Program Files (x86)\Microsoft\Edge\Application" -Filter "installer.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($edgeInstaller) {
    Start-Process -FilePath $edgeInstaller.FullName -ArgumentList "--uninstall --system-level --verbose-logging --force-uninstall" -Wait -WindowStyle Hidden
}

$webviewInstaller = Get-ChildItem -Path "C:\Program Files (x86)\Microsoft\EdgeWebView\Application" -Filter "installer.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($webviewInstaller) {
    Start-Process -FilePath $webviewInstaller.FullName -ArgumentList "--uninstall --msedgewebview --system-level --verbose-logging --force-uninstall" -Wait -WindowStyle Hidden
}

# 5. BLOQUEAR REINSTALACIÓN AUTOMÁTICA EN WINDOWS UPDATE
Write-Host "5. Desactivando actualizaciones automaticas de Edge..." -ForegroundColor Yellow
$registryPath = "HKLM:\SOFTWARE\Microsoft\EdgeUpdate"
if (!(Test-Path $registryPath)) { New-Item -Path $registryPath -Force | Out-Null }
Set-ItemProperty -Path $registryPath -Name "DoNotUpdateToEdgeWithChromium" -Value 1 -Type DWord -Force


# =====================================================================
# BLOQUEO DEFINITIVO DE WINDOWS UPDATE VÍA ACL Y KERNEL REGISTRY
# =====================================================================

Write-Host "Iniciando bloqueo estricto de Windows Update..." -ForegroundColor Cyan

# 1. Detener los servicios
Stop-Service -Name wuauserv -Force -ErrorAction SilentlyContinue
Stop-Service -Name WaaSMedicSvc -Force -ErrorAction SilentlyContinue
Stop-Service -Name bits -Force -ErrorAction SilentlyContinue

# 2. Tomar propiedad de las claves del registro de los servicios para poder cambiarlas
$services = @("wuauserv", "WaaSMedicSvc", "bits")

foreach ($service in $services) {
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Services\$service"
    
    # Cambiar tipo de inicio a 4 (Deshabilitado)
    Set-ItemProperty -Path $regPath -Name "Start" -Value 4 -Type DWord -Force -ErrorAction SilentlyContinue
    
    # Cambiar la ruta del ejecutable a algo inexistente para que falle si intenta iniciar
    Set-ItemProperty -Path $regPath -Name "ImagePath" -Value "C:\Windows\System32\svchost.exe -k nonexistentservice" -Type String -Force -ErrorAction SilentlyContinue
}

# 3. Bloquear el ejecutable de WaaSMedicSvc a nivel de permisos de archivo
$medicExe = "C:\Windows\System32\WaaSMedicSvc.dll"
if (Test-Path $medicExe) {
    takeown /f $medicExe /a 2>$null
    icacls $medicExe /deny "SYSTEM:(F)" 2>$null
    icacls $medicExe /deny "Administradores:(F)" 2>$null
    icacls $medicExe /deny "Administrators:(F)" 2>$null
}

# 4. Inhabilitar las tareas programadas de mantenimiento y reparación
$tasksToKill = @(
    "\Microsoft\Windows\WindowsUpdate\Scheduled Start",
    "\Microsoft\Windows\WindowsUpdate\Automatic App Update",
    "\Microsoft\Windows\WaaSMedic\PerformRemediation"
)

foreach ($task in $tasksToKill) {
    schtasks /change /tn "$task" /disable 2>$null
}

# 5. Redireccionar los servidores de Windows Update en el archivo HOSTS
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$wuDomains = @(
    "127.0.0.1 stats.microsoft.com",
    "127.0.0.1 windowsupdate.microsoft.com",
    "127.0.0.1 update.microsoft.com",
    "127.0.0.1 download.windowsupdate.com"
)

foreach ($domain in $wuDomains) {
    if ((Get-Content $hostsPath -ErrorAction SilentlyContinue) -notcontains $domain) {
        Add-Content -Path $hostsPath -Value $domain -ErrorAction SilentlyContinue
    }
}

Write-Host "Proceso completado. Por favor, reinicia el equipo para verificar." -ForegroundColor Green



# 6. DESACTIVAR TELEMETRÍA Y SERVICIOS INNECESARIOS
Write-Host "6. Desactivando Telemetria y rastreo para liberar Memoria/CPU..." -ForegroundColor Yellow
$telemetryServices = @("DiagTrack", "dmwappushservice", "sysmain")
foreach ($service in $telemetryServices) {
    Stop-Service -Name $service -ErrorAction SilentlyContinue
    Set-Service -Name $service -StartupType Disabled -ErrorAction SilentlyContinue
}
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Value 0 -Type DWord -Force

# 7. DESINSTALAR Y DESACTIVAR COPILOT
Write-Host "7. Desinstalando y desactivando Copilot..." -ForegroundColor Yellow
Get-AppxPackage *Copilot* -AllUsers | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.PackageName -like "*Copilot*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

$copilotPolicyPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot"
if (!(Test-Path $copilotPolicyPath)) { New-Item -Path $copilotPolicyPath -Force | Out-Null }
Set-ItemProperty -Path $copilotPolicyPath -Name "TurnOffWindowsCopilot" -Value 1 -Type DWord -Force

$taskbarPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
if (Test-Path $taskbarPath) { Set-ItemProperty -Path $taskbarPath -Name "ShowCopilotButton" -Value 0 -Type DWord -Force }

# 8. DESACTIVAR WINDOWS UPDATE Y BLOQUEAR SU REACTIVACIÓN
Write-Host "8. Deshabilitando Windows Update..." -ForegroundColor Yellow
$wuServices = @("wuauserv", "bits", "dosvc")
foreach ($service in $wuServices) {
    Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
    Set-Service -Name $service -StartupType Disabled -ErrorAction SilentlyContinue
}

$wuPolicyPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU"
if (!(Test-Path $wuPolicyPath)) { New-Item -Path $wuPolicyPath -Force | Out-Null }
Set-ItemProperty -Path $wuPolicyPath -Name "NoAutoUpdate" -Value 1 -Type DWord -Force

# 9. ELIMINAR ADOBE (Photoshop, Reader/Acrobat, Creative Cloud y sus servicios)
Write-Host "9. Eliminando productos y servicios de Adobe..." -ForegroundColor Yellow

# Detener procesos de Adobe que suelen quedar abiertos en segundo plano
$adobeProcesses = @("Adobe*", "AGSService", "CCXProcess", "CoreSync", "AcroRd32", "Acrobat")
foreach ($proc in $adobeProcesses) {
    Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

# Detener y deshabilitar servicios pesados de Adobe
$adobeServices = @("AdobeARMservice", "AGSService", "AGMService", "AdobeUpdateService", "CCXProcess")
foreach ($service in $adobeServices) {
    Stop-Service -Name $service -ErrorAction SilentlyContinue
    Set-Service -Name $service -StartupType Disabled -ErrorAction SilentlyContinue
}

# Desinstalar aplicaciones de Adobe mediante WMIC/Registry
$adobeApps = Get-WmiObject -Class Win32_Product | Where-Object { $_.Vendor -like "*Adobe*" }
foreach ($app in $adobeApps) {
    Write-Host "  Desinstalando $($app.Name)..." -ForegroundColor Gray
    $app.Uninstall() | Out-Null
}

# Eliminar carpetas residuales de Adobe
$adobePaths = @(
    "C:\Program Files\Adobe",
    "C:\Program Files (x86)\Adobe",
    "C:\Program Files\Common Files\Adobe",
    "C:\Program Files (x86)\Common Files\Adobe",
    "$env:LOCALAPPDATA\Adobe",
    "$env:APPDATA\Adobe"
)
foreach ($path in $adobePaths) {
    if (Test-Path $path) { Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue }
}

# 10. OPTIMIZAR ANTIMALWARE SERVICE EXECUTABLE (DEFENDER)
Write-Host "10. Optimizando Windows Defender para reducir uso de RAM/CPU..." -ForegroundColor Yellow
Add-MpPreference -ExclusionProcess "MsMpEng.exe" -ErrorAction SilentlyContinue
Add-MpPreference -ExclusionPath "C:\Program Files\Windows Defender" -ErrorAction SilentlyContinue
Set-MpPreference -ScanAvgCPULoadFactor 10 -ErrorAction SilentlyContinue


# =====================================================================
# ELIMINACIÓN DE ADOBE EXPRESS / PHOTOS (APPLICATIONS UWP / APPX)
# =====================================================================

Write-Host "Buscando y eliminando paquetes de Adobe Express / Photos..." -ForegroundColor Cyan

# 1. Detener cualquier proceso activo de la app
Get-Process -Name "*AdobeExpress*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "*PhotoshopExpress*" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Desinstalar el paquete AppX de TODOS los usuarios activos
Write-Host "Eliminando paquetes instalados en perfiles de usuario..." -ForegroundColor Yellow
Get-AppxPackage -AllUsers | Where-Object {$_.Name -like "*Adobe*" -or $_.Name -like "*PhotoshopExpress*"} | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue

# 3. Eliminar la app aprovisionada (evita que se reinstale sola al reiniciar o al iniciar nuevo usuario)
Write-Host "Eliminando paquetes aprovisionados de la imagen de Windows..." -ForegroundColor Yellow
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*Adobe*" -or $_.DisplayName -like "*PhotoshopExpress*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# 4. Eliminar accesos directos del menú inicio que puedan haber quedado huerfanos
$startMenuPaths = @(
    "C:\ProgramData\Microsoft\Windows\Start Menu\Programs",
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"
)
foreach ($path in $startMenuPaths) {
    Get-ChildItem -Path $path -Filter "*Adobe*" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
}

Write-Host "Adobe Express / Photos eliminado por completo." -ForegroundColor Green



# =====================================================================
# SCRIPT DE ELIMINACIÓN DEFINITIVA Y DESTRUCCIÓN DE TAREAS PROGRAMADAS
# Ejecutar como Administrador
# =====================================================================

Write-Host "Iniciando bloqueo persistente de Edge y Adobe..." -ForegroundColor Cyan

# 1. MATAR PROCESOS EN EJECUCIÓN
Write-Host "1. Finalizando procesos en memoria..." -ForegroundColor Yellow
$processesToKill = @("msedge", "MicrosoftEdge*", "msedgewebview2", "AGSService", "Adobe*", "CCXProcess", "CoreSync")
foreach ($proc in $processesToKill) {
    Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

# 2. ELIMINAR TAREAS PROGRAMADAS (Principal causa de reaparición)
Write-Host "2. Eliminando tareas programadas de autorreparacion..." -ForegroundColor Yellow
$tasks = @(
    "\Microsoft\EdgeUpdate\*",
    "Adobe*",
    "Adobe Genuine*",
    "Adobe Acrobat Update*"
)
foreach ($task in $tasks) {
    Unregister-ScheduledTask -TaskName $task -Confirm:$false -ErrorAction SilentlyContinue
}
# Metodo por consola para asegurar el borrado de tareas persistentes
schtasks /delete /tn "MicrosoftEdgeUpdateTaskMachineCore" /f 2>$null
schtasks /delete /tn "MicrosoftEdgeUpdateTaskMachineUA" /f 2>$null
schtasks /delete /tn "Adobe Genuine Software Integrity Service" /f 2>$null

# 3. ELIMINAR SERVICIOS DEL SISTEMA (Edge Update y Adobe)
Write-Host "3. Eliminando servicios del sistema..." -ForegroundColor Yellow
$servicesToDelete = @("edgeupdate", "edgeupdatem", "AGSService", "AdobeARMservice", "AGMService", "AdobeUpdateService")
foreach ($srv in $servicesToDelete) {
    Stop-Service -Name $srv -Force -ErrorAction SilentlyContinue
    Set-Service -Name $srv -StartupType Disabled -ErrorAction SilentlyContinue
    sc.exe delete $srv 2>$null
}

# 4. BORRADO FORZADO Y BLOQUEO DE CARPETAS DE EDGE
Write-Host "4. Destruyendo ejecutables de Microsoft Edge..." -ForegroundColor Yellow
$edgeFolders = @(
    "C:\Program Files (x86)\Microsoft\Edge",
    "C:\Program Files (x86)\Microsoft\EdgeCore",
    "C:\Program Files (x86)\Microsoft\EdgeUpdate"
)
foreach ($folder in $edgeFolders) {
    if (Test-Path $folder) {
        # Tomar propiedad de la carpeta para poder eliminarla totalmente
        takeown /f $folder /r /d y 2>$null
        icacls $folder /grant administradores:F /t 2>$null
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 5. BORRADO FORZADO Y BLOQUEO DE CARPETAS DE ADOBE
Write-Host "5. Destruyendo ejecutables y servicios de Adobe..." -ForegroundColor Yellow
$adobeFolders = @(
    "C:\Program Files\Adobe",
    "C:\Program Files (x86)\Adobe",
    "C:\Program Files\Common Files\Adobe",
    "C:\Program Files (x86)\Common Files\Adobe",
    "C:\Program Files (x86)\Common Files\Adobe\AdobeGCClient"
)
foreach ($folder in $adobeFolders) {
    if (Test-Path $folder) {
        takeown /f $folder /r /d y 2>$null
        icacls $folder /grant administradores:F /t 2>$null
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 6. BLOQUEAR REGISTRO PARA IMPEDIR QUE WINDOWS UPDATE REINSTALE EDGE
Write-Host "6. Aplicando politicas de bloqueo permanente en Registro..." -ForegroundColor Yellow
$edgeReg = "HKLM:\SOFTWARE\Microsoft\EdgeUpdate"
if (!(Test-Path $edgeReg)) { New-Item -Path $edgeReg -Force | Out-Null }
Set-ItemProperty -Path $edgeReg -Name "DoNotUpdateToEdgeWithChromium" -Value 1 -Type DWord -Force

# =====================================================================
# REMOCIÓN DE GAMING SERVICES Y COPILOT EN TODOS LOS PERFILES
# Ejecutar como Administrador
# =====================================================================

Write-Host "Iniciando limpieza de Gaming Services y Copilot en perfiles locales..." -ForegroundColor Cyan

# 1. DETENER Y ELIMINAR SERVICIOS DE GAMING SERVICES (XBOX)
Write-Host "1. Deteniendo y desinstalando Gaming Services..." -ForegroundColor Yellow

# Detener procesos
Get-Process -Name "*GamingServices*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "*GamingServicesNet*" -ErrorAction SilentlyContinue | Stop-Process -Force

# Desinstalar paquetes AppX de Gaming Services para todos los usuarios
Get-AppxPackage -AllUsers *GamingServices* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*GamingServices*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# Eliminar los servicios del sistema de Windows
$gamingServices = @("GamingServices", "GamingServicesNet", "XblGameSave", "XboxGipSvc")
foreach ($service in $gamingServices) {
    Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
    Set-Service -Name $service -StartupType Disabled -ErrorAction SilentlyContinue
    sc.exe delete $service 2>$null
}

# 2. DESINSTALAR Y BLOQUEAR COPILOT DE TODOS LOS PERFILES DE USUARIO
Write-Host "2. Removiendo Copilot de todos los usuarios (incluyendo Alumno)..." -ForegroundColor Yellow

# Desinstalar el paquete AppX a nivel global y de imagen base
Get-AppxPackage -AllUsers *Copilot* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.PackageName -like "*Copilot*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

# Ocultar el boton de Copilot en el Registro de la maquina (HKLM) para afectar a todos los usuarios
$taskbarPolicy = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
if (!(Test-Path $taskbarPolicy)) { New-Item -Path $taskbarPolicy -Force | Out-Null }
Set-ItemProperty -Path $taskbarPolicy -Name "ShowCopilotButton" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue

# Desactivar la directiva de Copilot en todo el sistema
$copilotPolicy = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot"
if (!(Test-Path $copilotPolicy)) { New-Item -Path $copilotPolicy -Force | Out-Null }
Set-ItemProperty -Path $copilotPolicy -Name "TurnOffWindowsCopilot" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue

# 3. APLICAR CAMBIOS DE REGISTRO A PERFILES INACTIVOS (C:\Users)
# Carga las colmenas de registro de los demás usuarios (ej: Alumno) para aplicar la deshabilitación
Write-Host "3. Forzando deshabilitación de Copilot en perfiles locales inactivos..." -ForegroundColor Yellow
$userProfiles = Get-ChildItem -Path "C:\Users" -Directory | Where-Object { $_.Name -notmatch "Public|All Users|Default|Default User" }

foreach ($profile in $userProfiles) {
    $nthive = "$($profile.FullName)\NTUSER.DAT"
    if (Test-Path $nthive) {
        # Cargar registro del usuario
        reg load HKU\TempUser $nthive 2>$null
        
        # Desactivar boton de Copilot en ese perfil
        $userAdvPath = "HKU:\TempUser\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
        if (Test-Path $userAdvPath) {
            Set-ItemProperty -Path $userAdvPath -Name "ShowCopilotButton" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        }
        
        # Descargar registro
        [GC]::Collect()
        reg unload HKU\TempUser 2>$null
    }
}

Write-Host "Limpieza completada. Reinicia el equipo para aplicar los cambios." -ForegroundColor Green
# 1. Finalizar los procesos de Enlace Móvil en ejecución
Get-Process -Name "*PhoneExperienceHost*" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Desinstalar el paquete Enlace Móvil de TODOS los perfiles de usuario
Get-AppxPackage -AllUsers *YourPhone* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue

# 3. Eliminar la app aprovisionada para que no aparezca en usuarios nuevos
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*YourPhone*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
# ELIMINAR ENLACE MÓVIL (PHONE LINK / YOUR PHONE)
Write-Host "Eliminando Enlace Móvil..." -ForegroundColor Yellow
Get-Process -Name "*PhoneExperienceHost*" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-AppxPackage -AllUsers *YourPhone* | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue
Get-AppxProvisionedPackage -Online | Where-Object {$_.DisplayName -like "*YourPhone*"} | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue

Write-Host "Enlace Móvil eliminado con éxito de todos los usuarios." -ForegroundColor Green

Write-Host "Operacion completada. Reinicia el equipo para verificar." -ForegroundColor Green
Write-Host "Limpieza y configuracion completadas con exito." -ForegroundColor Green