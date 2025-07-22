FROM denoland/deno:alpine-2.4.2

WORKDIR /app

COPY deno.json .
COPY deno.lock .

RUN deno install

COPY . .

CMD ["deno", "run", "--allow-all", "main.ts"] 
