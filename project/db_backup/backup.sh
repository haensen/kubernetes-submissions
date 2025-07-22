#!/usr/bin/env bash
set -e

date=$(date '+%Y-%m-%d')
pg_dump -v postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB > /app/backup-$date.sql

gcloud auth login --cred-file=/creds/credentials.json
gcloud storage cp /app/backup-$date.sql gs://$BUCKET_NAME
