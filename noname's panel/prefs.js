/* exported init fillPreferencesWindow */

const {Adw, Gtk, Gio, GObject} = imports.gi;

let ExtensionUtils, Me, Pages, SwitchRow, _;
let PREFS_AVAILABLE = true;
try {
    ExtensionUtils = imports.misc.extensionUtils;
    Me = ExtensionUtils.getCurrentExtension();
    Pages = Me.imports.src.preferences.pages;
    SwitchRow = Me.imports.src.preferences.widgets.SwitchRow;
    _ = imports.gettext.domain(Me.metadata.uuid).gettext;
} catch (e) {
    log(`[nonamesPanel] prefs init failed: ${e}`);
    PREFS_AVAILABLE = false;
}

function init() {
    if (PREFS_AVAILABLE && ExtensionUtils) {
        try { ExtensionUtils.initTranslations(Me.metadata.uuid); } catch (e) { log(e); }
    }
}

if (PREFS_AVAILABLE) {

const ToggleRow = GObject.registerClass(
class ToggleRow extends Adw.ActionRow {
    constructor(subpage, settingName, subtitle = '') {
        super({title: subpage.title, subtitle});

        const gswitch = new Gtk.Switch({
            active: subpage.settings.get_boolean(settingName),
            valign: Gtk.Align.CENTER,
        });
        subpage.settings.bind(
            settingName,
            gswitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        this.add_suffix(gswitch);
        const icon = Gtk.Image.new_from_icon_name('go-next-symbolic');
        this.add_suffix(icon);
        this.activatable_widget = icon;

        this.activatable = gswitch.active;
        gswitch.connect('notify::active', () => {
            this.activatable = gswitch.active;
        });

        this.connect('activated', () => {
            const window = this.get_root();
            window.present_subpage(subpage);
        });
    }
});

const AboutPage = GObject.registerClass(
class AboutPage extends Adw.PreferencesPage {
    constructor() {
        super({
            title: _('About'),
            icon_name: 'info-symbolic',
        });

        const versionGroup = new Adw.PreferencesGroup();
        const versionRow = new Adw.ActionRow({title: _('Version:')});
        versionRow.add_suffix(new Gtk.Label({valign: Gtk.Align.CENTER, label: `${Me.metadata.version}`}));
        versionGroup.add(versionRow);
        this.add(versionGroup);
    }
});

const MainPage = GObject.registerClass(
class MainPage extends Adw.PreferencesPage {
    constructor() {
        super({
            title: _('Extensions'),
            icon_name: 'application-x-addon-symbolic',
        });

        const settings = ExtensionUtils.getSettings();
        const group = new Adw.PreferencesGroup();
        this.add(group);

        group.add(new ToggleRow(new Pages.BackgroundClockPage(settings), 'background-clock'));
        group.add(new ToggleRow(new Pages.BatteryBarPage(settings), 'battery-bar'));
        group.add(new ToggleRow(new Pages.DashBoardPage(settings), 'dash-board'));
        group.add(new ToggleRow(new Pages.DateMenuTweakPage(settings), 'date-menu-tweaks'));
        group.add(new ToggleRow(new Pages.DynamicPanelPage(settings), 'dynamic-panel'));
        group.add(new SwitchRow(_('Hide Window Headerbars'), settings, 'window-headerbar'));
        group.add(new ToggleRow(new Pages.NotificationIndicatorPage(settings), 'notification-indicator'));
        group.add(new ToggleRow(new Pages.MediaPlayerPage(settings), 'media-player'));
        group.add(new ToggleRow(new Pages.PowerMenuPage(settings), 'power-menu'));
        group.add(new ToggleRow(new Pages.StylishOSDPage(settings), 'stylish-osd'));
        group.add(new ToggleRow(new Pages.QuickSettingsTweaksPage(settings), 'quick-settings-tweaks'));
        group.add(new ToggleRow(new Pages.WorkspaceIndicatorPage(settings), 'workspace-indicator'));
    }
});

function fillPreferencesWindow(window) {
    window.add(new MainPage());
    window.add(new AboutPage());
    window.search_enabled = true;
    window.can_navigate_back = true;
}

} else {
    // Fallback when prefs cannot be initialized (e.g. incompatible environment)
    function fillPreferencesWindow(window) {
        if (window && window.add) {
            const label = new Gtk.Label({label: 'Preferences are unavailable on this system.'});
            try { window.add(label); } catch (e) { log(`[nonamesPanel] fallback prefs UI failed: ${e}`); }
        }
    }
}
