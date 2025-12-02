#!/bin/bash

# GNOME Panel Extension Installation Script
# Automatically handles installation and setup

set -e

EXTENSION_ID="nonamesPanel@noname"
EXTENSION_NAME="Panel Extension"
EXTENSION_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/noname's panel"
INSTALL_DIR="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_ID"

echo "=== GNOME Panel Extension Installer ==="
echo ""

# Check if source exists
if [ ! -d "$EXTENSION_DIR" ]; then
    echo "❌ Error: Extension source not found at: $EXTENSION_DIR"
    exit 1
fi

echo "📦 Installing $EXTENSION_NAME..."
echo "   From: $EXTENSION_DIR"
echo "   To:   $INSTALL_DIR"
echo ""

# Create extensions directory if needed
mkdir -p "$(dirname "$INSTALL_DIR")"

# Remove existing installation
if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 Removing existing installation..."
    rm -rf "$INSTALL_DIR"
fi

# Copy extension
echo "📋 Copying extension files..."
cp -r "$EXTENSION_DIR" "$INSTALL_DIR"

# Compile GSettings schema
if [ -d "$INSTALL_DIR/resources/schemas" ]; then
    echo "⚙️  Compiling GSettings schema..."
    cd "$INSTALL_DIR/resources/schemas"
    glib-compile-schemas . 2>&1 || echo "⚠️  Warning: Could not compile schemas (glib-compile-schemas not found)"
fi

# Try to enable the extension
echo ""
echo "✨ Installation complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Restart GNOME Shell (Alt + F2, type 'r', press Enter)"
echo "   Or log out and log back in"
echo ""
echo "2. Enable the extension:"
echo "   gnome-extensions enable $EXTENSION_ID"
echo ""
echo "3. Open GNOME Settings and go to Extensions"
echo "   Look for '$EXTENSION_NAME'"
echo ""
echo "For troubleshooting, run:"
echo "   bash $(dirname "$EXTENSION_DIR")/diagnose.sh"
echo ""

# Try to enable if gnome-extensions is available
if command -v gnome-extensions &> /dev/null; then
    echo "Attempting to enable extension..."
    if gnome-extensions enable "$EXTENSION_ID" 2>/dev/null; then
        echo "✓ Extension enabled successfully!"
    else
        echo "⚠️  Could not auto-enable. Please enable manually in Settings."
    fi
fi
