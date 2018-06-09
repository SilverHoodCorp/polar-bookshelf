sudo apt-get install icnsutils


SIZES="512 256 128 64 32 16"
for size in ${SIZES}; do
    echo "Creating icon of size: ${size}"
    convert -resize ${size}x${size} 512.png ${size}.png
done

png2icns icon.icns 512.png 256.png 128.png

