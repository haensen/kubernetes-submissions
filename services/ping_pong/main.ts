import { Hono } from "@hono/hono";

let count = 0;

const FILE = Deno.env.get("FILE");

const app = new Hono();

app.get("/pingpong", (c) => {
    Deno.writeTextFileSync(FILE, `Ping / Pongs: ${count}`);
    return c.text(`pong ${count++}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
