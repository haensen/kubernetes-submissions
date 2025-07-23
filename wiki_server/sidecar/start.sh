#!/usr/bin/env bash

mkdir -p /usr/share/nginx/html

while true; do
    sleep $(((5 + $RANDOM % 11) * 60))

    URL="$(curl -sI "https://en.wikipedia.org/wiki/Special:Random" | grep ^location: | tr -d '\015' | awk '{ print $2}' -)"
    FILE="$(echo "${URL}" | awk -F / '{print $NF}')"
    echo ""${URL}" -> "${FILE}".html"
    curl "${URL}" > /usr/share/nginx/html/${FILE}.html
    ls -l /usr/share/nginx/html
done
