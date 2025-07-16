import { Hono } from "@hono/hono";

const FILE = Deno.env.get("FILE");
const PING_PONG_FILE = Deno.env.get("PING_PONG_FILE");

const app = new Hono();

app.get("/", (c) => {
    const randomContent = Deno.readTextFileSync(FILE);
    const pingPongContent = Deno.readTextFileSync(PING_PONG_FILE);
    return c.text(`${randomContent}\n${pingPongContent}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
