import { Hono } from "@hono/hono";

const app = new Hono();

const PAGE_PATH = Deno.env.get("PAGE_PATH");
const pageContent = await fetch(PAGE_PATH).then(res => res.text());

app.get("/", (c) => c.html(pageContent));

const PORT = 80;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
