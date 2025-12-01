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
    constructor() {
        this._extensions = {};
    }

    enable() {
        try {
            const settings = ExtensionUtils.getSettings();
            
            for (const [name, config] of Object.entries(Extensions)) {
                try {
                    const module = this._importModule(config.path);
                    if (!module || !module.Extension) {
                        console.warn(`[${Me.metadata.uuid}] Module ${config.path} missing Extension class`);
                        continue;
                    }
                    
                    const extension = new module.Extension(settings);
                    this._extensions[name] = extension;
                    
                    if (settings.get_boolean(config.key))
                        this._toggleExtension(extension, true);

                    settings.connect(`changed::${config.key}`, () => {
                        const isEnabled = settings.get_boolean(config.key);
                        this._toggleExtension(extension, isEnabled);
                    });
                } catch (error) {
                    console.warn(`[${Me.metadata.uuid}] Failed to load ${name}: ${error.message}`);
                }
            }
        } catch (error) {
            console.error(`[${Me.metadata.uuid}] Extension enable failed: ${error.message}`);
        }
    }

    disable() {
        try {
            for (const [name, extension] of Object.entries(this._extensions)) {
                try {
                    if (extension && extension.enabled) {
                        extension.disable();
                    }
                } catch (error) {
                    console.warn(`[${Me.metadata.uuid}] Failed to disable ${name}: ${error.message}`);
                }
            }
            this._extensions = {};
        } catch (error) {
            console.error(`[${Me.metadata.uuid}] Extension disable failed: ${error.message}`);
        }
    }

    _toggleExtension(extension, enable) {
        try {
            if (enable && !extension.enabled) {
                extension.enable();
                extension.enabled = true;
            } else if (!enable && extension.enabled) {
                extension.disable();
                extension.enabled = false;
            }
        } catch (error) {
            console.warn(`[${Me.metadata.uuid}] Toggle failed: ${error.message}`);
        }
    }

    _importModule(path) {
        try {
            const parts = path.split('.');
            let module = Me.imports;
            for (const part of parts) {
                module = module[part];
                if (!module) {
                    throw new Error(`Failed to load ${path}: part ${part} is undefined`);
                }
            }
            return module;
        } catch (error) {
            throw new Error(`Failed to import ${path}: ${error.message}`);
        }
    }
}

function init() {
    ExtensionUtils.initTranslations(Me.metadata.uuid);
    return new Extension();
}
