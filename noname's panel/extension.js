/* This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 */
/* exported init */
'use strict';

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Extensions = {
    backgroundClock: { path: 'src.features.panel.backgroundClock', key: 'background-clock' },
    batteryBar: { path: 'src.features.panel.batteryBar', key: 'battery-bar' },
    dashBoard: { path: 'src.features.modal.dashboard', key: 'dash-board' },
    dateMenuTweaks: { path: 'src.features.menu.dateMenuTweaks', key: 'date-menu-tweaks' },
    mediaPlayer: { path: 'src.services.mediaPlayer', key: 'media-player' },
    notificationIndicator: { path: 'src.features.menu.notificationIndicator', key: 'notification-indicator' },
    powerMenu: { path: 'src.features.modal.powerMenu', key: 'power-menu' },
    workspaceIndicator: { path: 'src.features.panel.workspaceIndicator', key: 'workspace-indicator' },
    dynamicPanel: { path: 'src.features.panel.dynamicPanel', key: 'dynamic-panel' },
    windowHeaderbar: { path: 'src.features.window.windowHeaderbar', key: 'window-headerbar' },
    quickSettingsTweaks: { path: 'src.features.menu.quickSettingsTweaks', key: 'quick-settings-tweaks' },
    stylishOSD: { path: 'src.features.osd.stylishOSD', key: 'stylish-osd' },
};

class Extension {
    enable() {
        const settings = ExtensionUtils.getSettings();

        for (const extension in Extensions) {
            if (Object.hasOwnProperty.call(Extensions, extension)) {
                const { path, key } = Extensions[extension];

                // Dynamically import based on path
                const module = this._importModule(path);
                this[extension] = new module.Extension(settings);
                
                if (settings.get_boolean(key))
                    this._toggleExtension(this[extension]);

                settings.connect(`changed::${key}`, () => {
                    this._toggleExtension(this[extension]);
                });
            }
        }
    }

    disable() {
        for (const extension in Extensions) {
            if (Object.hasOwnProperty.call(Extensions, extension)) {
                if (this[extension].enabled) {
                    this[extension].disable();
                    this[extension].enabled = false;
                }

                this[extension] = null;
            }
        }
    }

    _toggleExtension(extension) {
        if (!extension.enabled) {
            extension.enable();
            extension.enabled = true;
        } else {
            extension.disable();
            extension.enabled = false;
        }
    }

    _importModule(path) {
        // Convert dot notation to nested imports
        // e.g., 'src.features.panel.batteryBar' -> Me.imports.src.features.panel.batteryBar
        const parts = path.split('.');
        let module = Me.imports;
        for (const part of parts) {
            module = module[part];
        }
        return module;
    }
}

function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);
    return new Extension();
}
