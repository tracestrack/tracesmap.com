#!/usr/bin/env fish

npm run build
cd build
mv script.js tmp.js
sed "s/tiles.tracestrack.com/a.tiles.tracestrack.com/" tmp.js > script.js
