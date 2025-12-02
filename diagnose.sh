#!/bin/bash

# GNOME Panel Extension Diagnostic Script
# This script helps diagnose installation and compatibility issues

EXTENSION_ID="nonamesPanel@noname"
EXTENSION_PATH="$HOME/.local/share/gnome-shell/extensions/$EXTENSION_ID"
REPO_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== GNOME Panel Extension Diagnostic Report ==="
echo "Report generated: $(date)"
echo ""

# Check GNOME Shell version
echo "1. GNOME Shell Information"
echo "============================="
if command -v gnome-shell &> /dev/null; then
    gnome-shell --version
else
    echo "❌ GNOME Shell not found"
fi
echo ""

# Check if extension directory exists
echo "2. Extension Installation"
echo "============================="
if [ -d "$EXTENSION_PATH" ]; then
    echo "✓ Extension directory exists: $EXTENSION_PATH"
    echo ""
    echo "Contents:"
    ls -la "$EXTENSION_PATH" | tail -n +4 | awk '{print "  " $0}'
else
    echo "❌ Extension not installed at: $EXTENSION_PATH"
    echo "   Copy with: cp -r \"$REPO_PATH/noname's panel\" \"$EXTENSION_PATH\""
fi
echo ""

# Verify metadata.json
echo "3. Metadata Validation"
echo "============================="
METADATA="$EXTENSION_PATH/metadata.json"
if [ -f "$METADATA" ]; then
    echo "✓ metadata.json found"
    echo ""
    echo "Content:"
    cat "$METADATA" | sed 's/^/  /'
else
    echo "❌ metadata.json not found"
fi
echo ""

# Check GSettings schema
echo "4. GSettings Schema"
echo "============================="
if command -v gsettings &> /dev/null; then
    SCHEMA="org.gnome.shell.extensions.nonamesPanel"
    if gsettings list-schemas | grep -q "$SCHEMA"; then
        echo "✓ Schema registered: $SCHEMA"
        echo ""
        echo "Keys:"
        gsettings list-keys "$SCHEMA" 2>/dev/null | sed 's/^/  /' || echo "  (Unable to list keys)"
    else
        echo "❌ Schema not registered: $SCHEMA"
        echo "   Run: cd \"$EXTENSION_PATH\" && glib-compile-schemas resources/schemas/"
    fi
else
    echo "❌ gsettings not found"
fi
echo ""

# Check extension.js syntax
echo "5. Extension Code Check"
echo "============================="
if [ -f "$EXTENSION_PATH/extension.js" ]; then
    echo "✓ extension.js found"
    
    if grep -q "function init()" "$EXTENSION_PATH/extension.js"; then
        echo "✓ init() function defined"
    else
        echo "❌ init() function not found"
    fi
    
    if grep -q "class Extension" "$EXTENSION_PATH/extension.js"; then
        echo "✓ Extension class defined"
    else
        echo "❌ Extension class not found"
    fi
else
    echo "❌ extension.js not found"
fi
echo ""

# Check GNOME Shell logs
echo "6. Recent GNOME Shell Errors"
echo "============================="
if command -v journalctl &> /dev/null; then
    ERRORS=$(journalctl -u gnome-shell --since "1 hour ago" 2>/dev/null | grep -i "error\|warning" | grep -i "nonamesPanel" || echo "No errors found")
    if [ -z "$ERRORS" ]; then
        echo "✓ No recent extension errors in system logs"
    else
        echo "⚠️  Found errors:"
        echo "$ERRORS" | sed 's/^/  /'
    fi
else
    echo "⚠️  journalctl not available"
fi
echo ""

# Check file permissions
echo "7. File Permissions"
echo "============================="
if [ -d "$EXTENSION_PATH" ]; then
    PERMS=$(stat -c "%A" "$EXTENSION_PATH")
    echo "Extension directory: $PERMS"
    
    if [ -f "$EXTENSION_PATH/extension.js" ]; then
        PERMS=$(stat -c "%A" "$EXTENSION_PATH/extension.js")
        echo "extension.js: $PERMS"
    fi
else
    echo "⚠️  Extension directory not found"
fi
echo ""

# Summary
echo "8. Next Steps"
echo "============================="
echo ""
echo "If the extension is not working:"
echo ""
echo "1. Ensure GNOME Shell is running:"
echo "   ps aux | grep gnome-shell"
echo ""
echo "2. Compile GSettings schema:"
echo "   cd \"$EXTENSION_PATH/resources/schemas\""
echo "   glib-compile-schemas ."
echo ""
echo "3. Enable the extension:"
echo "   gnome-extensions enable $EXTENSION_ID"
echo ""
echo "4. Restart GNOME Shell:"
echo "   killall gnome-shell"
echo ""
echo "5. Check logs for errors:"
echo "   journalctl -f | grep -i nonamesPanel"
echo ""
echo "6. Clear extension cache:"
echo "   rm -rf ~/.cache/gnome-shell/"
echo ""

echo "=== End of Report ==="
