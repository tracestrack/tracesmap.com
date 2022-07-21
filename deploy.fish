#!/usr/bin/env fish

npm run build
cd build
mv script.js tmp.js
sed "s/710cc921fda7d757cc9b0aecd40ad3be/d750a1a29e913dea376aca86cc95de5a/" tmp.js > tmp2
sed "s/lz4.overpass-api.de/overpass.tracestrack.com/" tmp2 > script.js

rm tmp2

tar czvf ../xx.tar.gz .

scp -i ~/dev/tracestrack-cache-server/keys/aws-uk.pem ../xx.tar.gz ubuntu@18.169.228.79:/tmp
ssh -i ~/dev/tracestrack-cache-server/keys/aws-uk.pem ubuntu@18.169.228.79 "tar -xvf /tmp/xx.tar.gz -C /var/www/tracesmap.com/"
