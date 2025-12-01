# Project Structure

This document outlines the reorganized file structure of the Aylur's Widgets GNOME extension.

## Overview

The project has been reorganized from a flat extensions/shared structure to a feature-based, modular architecture. This improves:
- **Code Organization**: Features are logically grouped by functionality
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features or modify existing ones
- **Code Reusability**: Shared UI components and services are clearly separated

## Directory Structure

```
noname's panel/
├── src/                              # Source code
│   ├── features/                     # Feature implementations (UI widgets)
│   │   ├── panel/                    # Panel-based widgets (status indicators)
│   │   │   ├── backgroundClock.js    # Background clock widget
│   │   │   ├── batteryBar.js         # Battery status bar
│   │   │   ├── dynamicPanel.js       # Dynamic panel behavior
│   │   │   └── workspaceIndicator.js # Workspace switcher
│   │   ├── menu/                     # Menu-based widgets (date menu, quicksettings)
│   │   │   ├── dateMenuTweaks.js     # Date menu modifications
│   │   │   ├── notificationIndicator.js  # Notification indicators
│   │   │   └── quickSettingsTweaks.js    # Quick settings customizations
│   │   ├── modal/                    # Modal dialogs (dashboard, power menu)
│   │   │   ├── dashboard.js          # Dashboard modal
│   │   │   └── powerMenu.js          # Power menu dialog
│   │   ├── osd/                      # On-screen display
│   │   │   └── stylishOSD.js         # Styled OSD notifications
│   │   └── window/                   # Window-related features
│   │       └── windowHeaderbar.js    # Window headerbar customization
│   ├── services/                     # Shared services and utilities
│   │   ├── dashConfigParser.js       # Dashboard config parsing
│   │   ├── dashWidgets.js            # Dashboard widgets
│   │   ├── media.js                  # Media player service
│   │   ├── mediaPlayer.js            # Media player extension
│   │   ├── systemLevels.js           # System monitoring (CPU, RAM, etc.)
│   │   └── volumeMixer.js            # Volume mixer service
│   ├── ui/                           # Shared UI components
│   │   ├── levelBar.js               # Level/progress bar component
│   │   ├── notificationList.js       # Notification list display
│   │   ├── panelButton.js            # Panel button base class
│   │   └── userWidget.js             # User info widget
│   └── preferences/                  # Preferences UI
│       ├── pages.js                  # Preference pages
│       ├── prefs.js                  # Main preferences file
│       ├── widgets.js                # Preference widgets
│       └── workspaces.js             # Workspace preferences
├── resources/                        # Static resources
│   ├── config/                       # Configuration files
│   │   └── dashboard.json            # Dashboard layout config
│   ├── media/                        # Media assets
│   │   ├── prefs/                    # Preference UI images
│   │   └── [icon files]              # Extension icons and graphics
│   ├── schemas/                      # GSettings schema files
│   │   ├── gschemas.compiled         # Compiled schema database
│   │   └── org.gnome.shell.extensions.aylurs-widgets.gschema.xml
│   └── stylesheet.css                # Main stylesheet
├── extension.js                      # Extension entry point
├── prefs.js                          # Preferences entry point
├── metadata.json                     # Extension metadata
└── [config files]                    # .eslintrc.yml, .gitignore, etc.
```

## Module Organization

### Features (`src/features/*`)

Features are the individual widgets/extensions grouped by UI type:

- **Panel** - Widgets that appear in the top panel (status indicators, bars)
- **Menu** - Widgets integrated into GNOME menus (date menu, quick settings)
- **Modal** - Full-screen or dialog-based interfaces (dashboard, power menu)
- **OSD** - On-screen display overlays (volume, brightness notifications)
- **Window** - Window-related modifications (headerbar customization)

### Services (`src/services/*`)

Reusable service modules that provide functionality used by multiple features:

- **Media** - MPRIS media player integration
- **SystemLevels** - System monitoring (CPU, RAM, temperature, battery, storage)
- **DashConfigParser** - Dashboard configuration parsing
- **DashWidgets** - Dashboard widget implementations
- **VolumeMixer** - Audio volume management

### UI Components (`src/ui/*`)

Shared UI building blocks used across features:

- **LevelBar** - Reusable progress/level indicator
- **PanelButton** - Base class for panel buttons
- **NotificationList** - Notification display list
- **UserWidget** - User information display

### Preferences (`src/preferences/*`)

Preference UI implementation:

- **prefs.js** - Root preferences export
- **pages.js** - Individual preference pages for each feature
- **widgets.js** - Custom preference widgets
- **workspaces.js** - Workspace-related preferences

### Resources (`resources/*`)

Static files and configuration:

- **Schemas** - GSettings schema definitions
- **Config** - JSON configuration files (dashboard layouts)
- **Media** - Icons, images, and other assets
- **CSS** - Styling for the extension UI

## Import Conventions

All imports use the camelCase file naming convention for proper GJS module resolution:

```javascript
// Correct
const Me = imports.misc.extensionUtils.getCurrentExtension();
const {LevelBar} = Me.imports.src.ui.levelBar;
const {SystemLevels} = Me.imports.src.services.systemLevels;

// Features import services and UI components
const Media = Me.imports.src.services.media;
```

## File Naming

- **Files**: camelCase (e.g., `batteryBar.js`, `levelBar.js`)
- **Directories**: lowercase with hyphens (e.g., `src/features/panel/`)
- **Classes/Exports**: PascalCase (e.g., `LevelBar`, `BatteryBar`)
- **Functions**: camelCase (e.g., `updateLevel()`, `toggleExtension()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CACHE_PATH`, `HIDE_TIMEOUT`)

## Adding New Features

To add a new feature:

1. Create a new directory under `src/features/<category>/`
2. Implement the feature module following the existing pattern:
   ```javascript
   /* exported Extension */
   class Extension {
       constructor(settings) { ... }
       enable() { ... }
       disable() { ... }
   }
   var Extension = Extension;
   ```
3. Add the feature to the `Extensions` map in `extension.js`
4. Create preference pages in `src/preferences/pages.js`
5. Add configuration keys to `resources/schemas/org.gnome.shell.extensions.aylurs-widgets.gschema.xml`

## Migration Notes

This structure was migrated from the original flat organization:
- Old `extensions/` → New `src/features/<type>/`
- Old `shared/` → New `src/ui/` + `src/services/`
- Old `pref/` → New `src/preferences/`
- Old `schemas/`, `config/`, `media/` → New `resources/*/`

All import paths have been updated to reflect the new structure.
