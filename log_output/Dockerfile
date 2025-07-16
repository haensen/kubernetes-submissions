FROM denoland/deno:alpine-2.3.6

WORKDIR /app

COPY deno.json .

RUN deno install

COPY . .

CMD ["deno", "run", "--allow-all", "main.ts"] 
