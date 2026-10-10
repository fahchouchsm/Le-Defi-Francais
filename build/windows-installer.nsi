Unicode True
!include "MUI2.nsh"

Name "Le Défi Français"
OutFile "../dist/Le-Defi-Francais-Setup-1.1.0.exe"
InstallDir "$LOCALAPPDATA\Programs\Le Défi Français"
RequestExecutionLevel user
SetCompressor /SOLID lzma
Icon "icon.ico"
UninstallIcon "icon.ico"

!define MUI_ABORTWARNING
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "French"

Section "Installer"
  SetOutPath "$INSTDIR"
  File /r "../dist/win-unpacked/*"
  WriteUninstaller "$INSTDIR\Désinstaller.exe"
  CreateShortcut "$DESKTOP\Le Défi Français.lnk" "$INSTDIR\Le Défi Français.exe"
  CreateDirectory "$SMPROGRAMS\Le Défi Français"
  CreateShortcut "$SMPROGRAMS\Le Défi Français\Le Défi Français.lnk" "$INSTDIR\Le Défi Français.exe"
  CreateShortcut "$SMPROGRAMS\Le Défi Français\Désinstaller.lnk" "$INSTDIR\Désinstaller.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LeDefiFrancais" "DisplayName" "Le Défi Français"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LeDefiFrancais" "DisplayVersion" "1.1.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LeDefiFrancais" "UninstallString" '"$INSTDIR\Désinstaller.exe"'
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\Le Défi Français.lnk"
  Delete "$SMPROGRAMS\Le Défi Français\Le Défi Français.lnk"
  Delete "$SMPROGRAMS\Le Défi Français\Désinstaller.lnk"
  RMDir "$SMPROGRAMS\Le Défi Français"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\LeDefiFrancais"
  RMDir /r "$INSTDIR"
SectionEnd
