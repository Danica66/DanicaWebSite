#!/bin/sh
echo "Waiting for back:3000..."
while ! wget -qO- http://back:3000/api/rss > /dev/null 2>&1; do
  sleep 2
done
echo "Backend is ready, starting nginx..."
exec nginx -g "daemon off;"
