#!/usr/bin/env fish

npm run build
cd build
mv script.js tmp.js
sed "s/710cc921fda7d757cc9b0aecd40ad3be/d750a1a29e913dea376aca86cc95de5a/" tmp.js > script.js

sed "s/lz4.overpass-api.de/overpass.tracestrack.com/" tmp.js > script.js

scp -r * root@h2934425.stratoserver.net:/root/web
