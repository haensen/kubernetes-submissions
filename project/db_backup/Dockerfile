FROM google/cloud-sdk:alpine

WORKDIR /app

RUN apk add --no-cache postgresql16-client

COPY backup.sh .

CMD ["/app/backup.sh"]
