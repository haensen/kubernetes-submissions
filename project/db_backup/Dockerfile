FROM google/cloud-sdk:alpine

WORKDIR /app

RUN apk add --no-cache postgresql16-client

COPY --chmod=755 backup.sh .

CMD ["/app/backup.sh"]
