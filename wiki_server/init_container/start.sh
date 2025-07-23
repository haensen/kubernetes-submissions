#!/usr/bin/env bash

mkdir -p /usr/share/nginx/html

curl https://en.wikipedia.org/wiki/Kubernetes > /usr/share/nginx/html/kubernetes.html
