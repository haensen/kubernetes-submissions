import { Hono } from "@hono/hono";

const app = new Hono();

app.get("/", (c) => c.text("Hello World"));

const PORT = Deno.env.get("PORT") || 8080;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
