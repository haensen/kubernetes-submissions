import { Hono } from "@hono/hono";

const FILE = Deno.env.get("FILE");
const MESSAGE = Deno.env.get("MESSAGE");
const configMapFileContent = Deno.readTextFileSync("/config/information.txt");

const app = new Hono();

app.get("/", async (c) => {
    const randomContent = Deno.readTextFileSync(FILE);
    const pingPongContent = await fetch("http://ping-pong-svc:80/pings").then(res => res.text());
    return c.text(`file content: ${configMapFileContent}\nmessage: ${MESSAGE}\n${randomContent}\n${pingPongContent}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
