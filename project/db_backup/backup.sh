#!/usr/bin/env bash
set -e

ls -lah

if [ $URL ]
then
  date=$(date '+%Y-%m-%d')
  pg_dump -v $URL > /app/backup-$date.sql

  gcloud auth login --cred-file=/creds/credentials.json
  gcloud storage cp /app/backup-$date.sql gs://$BUCKET_NAME
fi