project('gnome-panel-extension',
  version: '0.1.0',
  meson_version: '>= 0.50.0',
  default_options: [
    'prefix=/usr',
    'libdir=lib',
    'libexecdir=libexec',
    'bindir=bin',
    'sbindir=sbin',
    'includedir=include',
    'datadir=share',
    'mandir=share/man',
    'localedir=share/locale',
  ]
)

# Extension UUID and path
extension_uuid = 'nonamesPanel@noname'
extension_dir = join_paths(get_option('prefix'), 'share/gnome-shell/extensions', extension_uuid)

# Install extension files
install_subdir(
  extension_uuid,
  install_dir: join_paths(get_option('prefix'), 'share/gnome-shell/extensions'),
  strip_directory: true
)

# Compile schemas
gnome = import('gnome')

# Install and compile schemas
gnome.post_install(
  glib_compile_schemas: true,
  gtk_update_icon_cache: true,
  update_desktop_database: true
)

# Install schema
install_data(
  join_paths(extension_uuid, 'schemas', 'org.gnome.shell.extensions.nonamesPanel.gschema.xml'),
  install_dir: join_paths(get_option('datadir'), 'glib-2.0/schemas')
)
# Create a symlink in the build directory
meson.add_install_script('sh', '-c',
  'ln -sf "$DESTDIR$1/gnome-shell/extensions/$2" "$MESON_BUILD_ROOT/extension"',
  'dummy',
  get_option('prefix'),
  extension_uuid
)
