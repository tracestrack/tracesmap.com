#!/usr/bin/env bash

npm run build
cd build
mv script.js tmp.js
sed "s/710cc921fda7d757cc9b0aecd40ad3be/d750a1a29e913dea376aca86cc95de5a/" tmp.js > tmp2
sed "s/lz4.overpass-api.de/overpass.tracestrack.com/" tmp2 > script.js

rm tmp2
