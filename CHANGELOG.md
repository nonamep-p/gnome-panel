# Changelog

## [25] - 2025-12-02

### Added
- Support for GNOME 45, 46, 47, and 48
- Actively maintained - extension has been revived
- New STRUCTURE.md documentation for file organization

### Changed
- **MAJOR REORGANIZATION**: Restructured project from flat extensions/shared layout to feature-based modular architecture
  - Features grouped by UI type: `src/features/{panel,menu,modal,osd,window}/`
  - Shared utilities organized into: `src/ui/` (components) and `src/services/` (functionality)
  - Preferences moved to: `src/preferences/`
  - Resources (schemas, config, media) moved to: `resources/`
- Updated metadata.json to reflect GNOME version support
- Updated README with comprehensive documentation
- Replaced deprecated `Gio.Settings` schema parameter (`schema` → `schema_id`)
- Replaced deprecated `Mainloop` with modern `GLib` timeout functions
- All import paths updated to match new directory structure
- Files renamed to camelCase for proper GJS module resolution

### Fixed
- Fixed workspaceIndicator.js Gio.Settings API call for GNOME 45+ compatibility
- Updated systemLevels.js to use `GLib.timeout_add_seconds()` and `GLib.source_remove()` instead of deprecated Mainloop API

### Notes
- All 13 sub-extensions are now compatible with GNOME 45+
- Code maintains backward compatibility where possible
- ByteArray handling remains for cross-version compatibility
- New modular structure makes it easier to add features and maintain code

## [24] - Previous release (discontinued)

- Last version by original author (Aylur)
- Supported GNOME 44 only
