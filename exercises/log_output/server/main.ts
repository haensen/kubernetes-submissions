import { Hono } from "@hono/hono";

const FILE = Deno.env.get("FILE");
const MESSAGE = Deno.env.get("MESSAGE");
const configMapFileContent = Deno.readTextFileSync("/config/information.txt");
const PINGPONG_URL = Deno.env.get("PINGPONG_URL") || "http://ping-pong-svc:80";

const app = new Hono();

app.get("/", async (c) => {
    const randomContent = Deno.readTextFileSync(FILE);
    const pingPongContent = await fetch(`${PINGPONG_URL}/pings`).then(res => res.text());
    const greeterContent = await fetch(Deno.env.get("GREETER_URL")).then(res => res.text());
    return c.text(`file content: ${configMapFileContent}\nmessage: ${MESSAGE}\n${randomContent}\n${pingPongContent}\ngreetings: ${greeterContent}`);
});

app.get("/healthz", async (c) => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 500);
    return await fetch(`${PINGPONG_URL}/pings`, { signal: abortController.signal })
        .then(res => {
            clearTimeout(timeout);
            if (res.status !== 200) {
                throw new Error("Ping-Pong service is not healthy");
            }
        })
        .then(() => {
            return c.text("OK");
        })
        .catch(e => {
            clearTimeout(timeout);
            console.error(e);
            c.status(500);
            return c.text("ERROR");
        });
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
