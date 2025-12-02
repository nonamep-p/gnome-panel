# Contributing to GNOME Panel Extension

Thank you for your interest in contributing to the GNOME Panel Extension! Here's how you can help:

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create a new branch** for your changes
4. **Commit** your changes with clear messages
5. **Push** to your fork and submit a pull request

## Development Setup

### Prerequisites
- GNOME Shell 45 or later
- Node.js (for building)
- Gettext (for translations)
- jq (for JSON processing)

### Building

1. Install dependencies:
   ```bash
   sudo apt install gettext jq
   ```

2. Build the extension:
   ```bash
   meson setup build
   ninja -C build
   ```

### Testing

1. Install the extension:
   ```bash
   ./install.sh
   ```

2. Enable the extension:
   ```bash
   gnome-extensions enable nonamesPanel@noname
   ```

3. Restart GNOME Shell (Alt+F2, type 'r', press Enter)

4. Run diagnostics:
   ```bash
   ./diagnose.sh
   ```

## Code Style

- Use 4 spaces for indentation
- Follow the GNOME JavaScript style guide
- Document public APIs with JSDoc
- Keep commits focused and atomic

## Pull Requests

1. Keep PRs focused on a single feature/bugfix
2. Update documentation as needed
3. Add tests if applicable
4. Ensure all tests pass
5. Reference any related issues

## Reporting Issues

When reporting issues, please include:
- GNOME Shell version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Any error messages from the logs

## License

By contributing, you agree to license your contributions under the GPL-3.0 license.
