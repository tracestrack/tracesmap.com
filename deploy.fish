#!/usr/bin/env fish

npm run build
cd build
mv script.js tmp.js
#sed "s/tiles.tracestrack.com/{a-b}.tiles.tracestrack.com/" tmp.js > script.js

#sed "s/subserver = '';//" tmp.js > tmp1.js
#sed "s/pk.eyJ1Ijoic3Ryb25nd2lsbG93IiwiYSI6ImxKa2R1SEkifQ.iZ_vj1lvuvrAcUIl0ZE5XA/pk.eyJ1Ijoic3Ryb25nd2lsbG93IiwiYSI6ImNrcXBvbzdqbTBqMzYyb3BiZDJ4a2JvZTIifQ.FtMTR0PSJtA8sqEiixl0CA/" tmp1.js > tmp2.js
sed "s/lz4.overpass-api.de/overpass.tracestrack.com/" tmp.js > script.js

scp -r * root@h2934425.stratoserver.net:/var/www/html
