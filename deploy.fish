#!/usr/bin/env fish

npm run build
cd build
mv script.js tmp.js
#sed "s/tiles.tracestrack.com/{a-b}.tiles.tracestrack.com/" tmp.js > script.js

sed "s/subserver = '';//" tmp.js > script.js


scp -r * root@h2934425.stratoserver.net:/var/www/html