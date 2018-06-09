# FIXME: nopw the problem must be that the installed icon is teh ELECTRON icon...

# https://www.electron.build/icons

# https://github.com/electron-userland/electron-builder/issues/2577
#
# this documents the image width issues.

# https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#icon
#
# Linux: this option is not required, as the dock/window list icon is set via
# the icon option in the BrowserWindow constructor. Please note that you need
# to use a PNG, and not the OS X or Windows icon formats, in order for it to
# show up in the dock/window list. Setting the icon in the file manager is not
# currently supported.
#icon: ./icons/icon-512.png

sudo apt-get install icnsutils


# note.. 64 is not supported.

SIZES="512 256 128 32 16"
for size in ${SIZES}; do
    echo "Creating icon of size: ${size}"
    convert -resize ${size}x${size} 512.png ${size}.png
done

png2icns icon.icns 512.png 256.png 128.png 32.png 16.png

