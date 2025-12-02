# GNOME Panel Extension

A powerful and customizable GNOME Shell extension that enhances your panel and desktop with useful widgets and system information.

## Features

- **Battery Bar** — Visual battery status indicator in the panel
- **Dashboard** — Customizable dashboard with multiple widgets
- **Date Menu Tweaks** — Enhanced date menu with system information
- **Media Player** — Media playback controls and information
- **Power Menu** — Quick access to power options
- **Workspace Indicator** — Visual workspace switcher
- **Notification Indicator** — Notification center access
- **Quick Settings Tweaks** — Customizable quick settings menu
- **Background Clock** — Desktop background clock widget
- **Dynamic Panel** — Adaptive panel behavior and styling
- **Window Headerbar** — Window header customization
- **Stylish OSD** — Custom on-screen display overlays

## Compatibility

- **GNOME 45, 46, 47, 48**

## Installation

### Method 1: Automated Installation (Recommended)

Run the installation script:

```bash
bash install.sh
```

This will:
- Copy the extension to the correct directory
- Compile the GSettings schema
- Enable the extension (if possible)

### Method 2: Manual Installation

```bash
cp -r "noname's panel" ~/.local/share/gnome-shell/extensions/nonamesPanel@noname
```

2. Restart GNOME Shell:
   - Press `Alt + F2`, type `r`, and press Enter
   - Or log out and log back in

3. Enable the extension in GNOME Settings or the Extensions app

### Method 3: Quick Enable

```bash
gnome-extensions enable "nonamesPanel@noname"
```

## Diagnostics

If you encounter issues, run the diagnostic script:

```bash
bash diagnose.sh
```

This will check:
- GNOME Shell version compatibility
- Extension installation path
- GSettings schema registration
- Recent error logs
- File permissions

## Configuration

Access the extension preferences through:
- **GNOME Settings** → Extensions → Panel Extension (⚙️ icon)
- Or **GNOME Extensions** app

Enable or disable individual features to customize your experience.

## Troubleshooting

### Extension Not Appearing in Settings

1. **Check installation path:**
   ```bash
   ls ~/.local/share/gnome-shell/extensions/nonamesPanel@noname/
   ```
   Should show: `extension.js`, `metadata.json`, `prefs.js`, `resources/`, `src/`, `stylesheet.css`

2. **Verify metadata.json:**
   ```bash
   cat ~/.local/share/gnome-shell/extensions/nonamesPanel@noname/metadata.json
   ```
   Ensure it has valid JSON syntax and includes required fields: `uuid`, `shell-version`, `settings-schema`

3. **Check GNOME Shell logs:**
   ```bash
   journalctl -f | grep -i "nonamesPanel"
   ```
   Look for error messages indicating what went wrong

4. **Force enable:**
   ```bash
   gnome-extensions enable nonamesPanel@noname
   ```

### Features Not Working

1. **Verify GSettings schema:**
   ```bash
   gsettings list-schemas | grep nonamesPanel
   ```

2. **Check individual feature status:**
   - Open Extension Preferences
   - Enable/disable individual features
   - Check if changes take effect

3. **Clear cache and restart:**
   ```bash
   rm -rf ~/.cache/gnome-shell/
   killall gnome-shell
   ```

### Performance Issues

- Disable unused features in preferences
- Check system resources: CPU, RAM, disk space
- Review GNOME Shell logs for errors

### Uninstallation

```bash
rm -rf ~/.local/share/gnome-shell/extensions/nonamesPanel@noname
gnome-extensions disable nonamesPanel@noname
```
