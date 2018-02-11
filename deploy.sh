#!/bin/sh


rsync -az build/* liza@45.55.252.134:used-books/

resp=$(curl -X DELETE "https://api.cloudflare.com/client/v4/zones/2b3dcf5abc99772b1cccb4c5b5d13e04/purge_cache" \
     -H "X-Auth-Email: lizadaly@gmail.com" \
     -H "X-Auth-Key: $CLOUDFLARE_API_KEY" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}' \
     --write-out %{http_code} --silent --output /dev/null)

echo "Status: $resp"
