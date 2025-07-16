import { Hono } from "@hono/hono";

const FILE = Deno.env.get("FILE");

const app = new Hono();

app.get("/", (c) => {
    const content = Deno.readTextFileSync(FILE);
    return c.text(content);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
