import { Hono } from "@hono/hono";

const createRandomString = () => {
    return Math.random().toString(36).substring(2);
}

const randomString = createRandomString();

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);

const app = new Hono();

app.get("/", (c) => c.text(`${new Date().toISOString()}: ${randomString}`));

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
