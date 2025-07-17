import { Hono } from "@hono/hono";

let count = 0;

const app = new Hono();

app.get("/pingpong", (c) => {
    return c.text(`pong ${count++}`);
});

app.get("/pings", (c) => {
    return c.text(`Ping / Pongs: ${count}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
