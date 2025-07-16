import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => c.html("<h1>Hello World</h1>"));

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
