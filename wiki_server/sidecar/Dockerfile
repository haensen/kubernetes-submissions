FROM alpine:3

WORKDIR /app

RUN apk add --no-cache bash
RUN apk add --no-cache curl

COPY --chmod=755 start.sh .

CMD ["bash", "/app/start.sh"]
