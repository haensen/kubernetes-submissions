import { Hono } from "@hono/hono";

const VERSION = Deno.env.get("VERSION") || "unknown";

const app = new Hono();

app.get("/", async (c) => {
    return c.text(`Hello from greeter version ${VERSION}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
